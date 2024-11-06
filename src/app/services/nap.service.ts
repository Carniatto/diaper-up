import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, where, orderBy, getDocs, deleteDoc, doc, updateDoc, or, and } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

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
    const newNap: Nap = {
      startTime: new Date().toUTCString(),
      endTime: '',
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
      endTime: new Date().toUTCString()
    });
    
    await this.loadTodayNaps(userId);
  }

  async loadTodayNaps(userId: string): Promise<void> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const startOfDayUTC = startOfDay.toUTCString();
    const endOfDayUTC = endOfDay.toUTCString();
    
    const napsCollection = collection(this.firestore, 'naps');
    const q = query(
      napsCollection,
      and(
        where('user', '==', userId),
      or(
        where('startTime', '>=', startOfDayUTC),
        where('startTime', '<=', endOfDayUTC)
      ),
      or(
        where('endTime', '>=', startOfDayUTC),
        where('endTime', '<=', endOfDayUTC),
        where('endTime', '==', '')
      )
      ),
      orderBy('startTime', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const naps: Nap[] = [];
    
    querySnapshot.forEach((doc) => {
      naps.push({ id: doc.id, ...doc.data() } as Nap);
    });

    this.napsSubject.next(naps);
  }

  async deleteNap(napId: string, userId: string): Promise<void> {
    const napRef = doc(this.firestore, 'naps', napId);
    await deleteDoc(napRef);
    await this.loadTodayNaps(userId);
  }
} 