import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, where, orderBy, getDocs, deleteDoc, doc, updateDoc, or, and, Timestamp } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { async, BehaviorSubject } from 'rxjs';
import { endOfDay, startOfDay } from 'date-fns';

export interface Nap {
  id?: string;
  startTime: string;
  endTime?: string;
  user: string;
}

@Injectable({
  providedIn: 'root'
})
export class NapService {
  private firestore = inject(Firestore);
  private napsSubject = new BehaviorSubject<Nap[]>([]);
  readonly naps = toSignal(this.napsSubject.asObservable());

  async startNap(userId: string): Promise<void> {
    const napsCollection = collection(this.firestore, 'naps');
    const newNap = {
      startTime: Timestamp.fromDate(new Date()),
      endTime: null,
      user: userId
    };
    
    // Save to Firebase immediately
    await addDoc(napsCollection, newNap);
    await this.loadTodayNaps(userId);
  }

  async endNap(userId: string): Promise<void> {
    const currentNaps = this.napsSubject.value;
    const ongoingNap = currentNaps.find(nap => !nap.endTime);
    
    if (!ongoingNap || !ongoingNap.id) return;

    const napRef = doc(this.firestore, 'naps', ongoingNap.id);
    await updateDoc(napRef, {
      endTime: Timestamp.fromDate(new Date())
    });
    
    await this.loadTodayNaps(userId);
  }

  async loadTodayNaps(userId: string): Promise<void> {
    const startOfDayUTC = startOfDay(new Date()).toUTCString();
    
    const endOfDayUTC = endOfDay(new Date()).toUTCString();
    
    const napsCollection = collection(this.firestore, 'naps');
    const q = query<any, any>(
      napsCollection,
      and(
        where('user', '==', userId),
        or(
          where('startTime', '>=', Timestamp.fromDate(new Date(startOfDayUTC))),
          where('startTime', '<=', Timestamp.fromDate(new Date(endOfDayUTC)))
        ),
        or(
          where('endTime', '>=', Timestamp.fromDate(new Date(startOfDayUTC))),
          where('endTime', '<=', Timestamp.fromDate(new Date(endOfDayUTC))),
          where('endTime', '==', null)
        )
      ),
      orderBy('startTime', 'desc')
    );

    const querySnapshot = await getDocs<{ user: string, startTime: Timestamp, endTime: Timestamp }, Nap>(q);
    const naps: Nap[] = [];
    querySnapshot.forEach((doc) => {
      naps.push({ id: doc.id, ...doc.data(), startTime: doc.data()['startTime'].toDate().toUTCString(), endTime: doc.data()['endTime']?.toDate().toUTCString() });
    });

    this.napsSubject.next(naps);
  }

  async deleteNap(napId: string, userId: string): Promise<void> {
    const napRef = doc(this.firestore, 'naps', napId);
    await deleteDoc(napRef);
    await this.loadTodayNaps(userId);
  }

  async editNap(napId: string, userId: string, startTime: string, endTime?: string): Promise<void> {
    const napRef = doc(this.firestore, 'naps', napId);
    
    await updateDoc(napRef, {
      startTime: Timestamp.fromDate(new Date(startTime)),
      endTime: endTime ? Timestamp.fromDate(new Date(endTime)) : null
    });
    await this.loadTodayNaps(userId);
  }
} 