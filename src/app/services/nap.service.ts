import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, Timestamp, deleteDoc, query, where, or, and, orderBy, getDocs, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, FirestoreError } from '@angular/fire/firestore';
import { endOfDay, startOfDay, subHours } from 'date-fns';
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
    await this.loadTodayNaps();
  }

  async update(napId: string, updates: Partial<Nap<Date>>): Promise<void> {
    const napRef = doc(this.napsCollection, napId);
    await updateDoc(napRef, updates);
    await this.loadTodayNaps();
  }

  async remove(napId: string): Promise<void> {
    const napRef = doc(this.napsCollection, napId);
    await deleteDoc(napRef);
    await this.loadTodayNaps();
  }


  async loadTodayNaps(date?: Date): Promise<void> {
    const selectedDate = date ?? new Date();
    const startOfDayUTC = startOfDay(selectedDate);
    const endOfDayUTC = endOfDay(selectedDate);
    const yesterdayAfternoon = subHours(startOfDayUTC, 12);
    
    const q = query(
      this.napsCollection,
      and(
        where('user', '==', this.userService.currentUser()!),
        or(
          and(
            where('startTime', '>=', Timestamp.fromDate(startOfDayUTC)),
            where('startTime', '<=', Timestamp.fromDate(endOfDayUTC))
          ),
          and(
            where('endTime', '>=', Timestamp.fromDate(startOfDayUTC)),
            where('endTime', '<=', Timestamp.fromDate(endOfDayUTC))
          ),
          and(
            where('type', '==', 'sleep'),
            where('startTime', '>=', Timestamp.fromDate(yesterdayAfternoon)),
            where('endTime', '<=', Timestamp.fromDate(endOfDayUTC))
          )
        )
      ),
      orderBy('startTime', 'desc')
    );
      try {
        const naps = await getDocs(q).then(docs => docs.docs.map(doc => doc.data()));
        this.naps.set(naps);
      } catch (error: unknown) {
        if (error instanceof FirestoreError) {
          console.error(error.code);
        } else {
          console.error('An unknown error occurred', error);
      }
    }
  }
} 
