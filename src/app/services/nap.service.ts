import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, Timestamp, deleteDoc, query, where, or, and, orderBy, getDocs, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { endOfDay, startOfDay } from 'date-fns';
import { UserService } from './user.service';

export interface Nap<T> {
  id?: string;
  startTime: T;
  endTime: T;
  user: string;
  type: 'nap' | 'sleep';
}

const napConverter: FirestoreDataConverter<Nap<Date>> = {
  toFirestore(nap: Nap<Date>): DocumentData {
    return {
      startTime: Timestamp.fromDate(nap.startTime),
      endTime: nap.endTime ? Timestamp.fromDate(nap.endTime) : null,
      user: nap.user,
      type: nap.type
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<Nap<Timestamp>>): Nap<Date> {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      startTime: data.startTime.toDate(),
      endTime: data.endTime.toDate(),
      user: data.user,
      type: data.type
    };
  }
};

@Injectable({
  providedIn: 'root'
})
export class NapService {
  private firestore = inject(Firestore);
  private userService = inject(UserService);
  readonly naps = signal<Nap<Date>[]>([]);

  private napsCollection = collection(this.firestore, 'naps').withConverter(napConverter);

  async create(nap: Omit<Nap<Date>, 'id'>): Promise<void> {
    await addDoc(this.napsCollection, nap);
    await this.loadTodayNaps(this.userService.currentUser()!);
  }

  async update(napId: string, updates: Partial<Nap<Date>>): Promise<void> {
    const napRef = doc(this.napsCollection, napId);
    await updateDoc(napRef, updates);
    await this.loadTodayNaps(this.userService.currentUser()!);
  }

  async remove(napId: string): Promise<void> {
    const napRef = doc(this.napsCollection, napId);
    await deleteDoc(napRef);
    await this.loadTodayNaps(this.userService.currentUser()!);
  }


  async loadTodayNaps(userId: string): Promise<void> {
    const startOfDayUTC = startOfDay(new Date());
    const endOfDayUTC = endOfDay(new Date());
    
    const q = query(
      this.napsCollection,
      and(
        where('user', '==', userId),
        or(
          where('startTime', '>=', startOfDayUTC),
          where('startTime', '<=', endOfDayUTC)
        ),
        or(
          where('endTime', '>=', startOfDayUTC),
          where('endTime', '<=', endOfDayUTC),
          where('endTime', '==', null)
        )
      ),
      orderBy('startTime', 'desc')
    );

    const naps = await getDocs(q).then(docs => docs.docs.map(doc => doc.data()));

    this.naps.set(naps);
  }

} 