
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

  type DiaperRoutine = {
  hasPeed: boolean;
  hasPooped: boolean;
  Timestamp?: [number, number]
}
@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  firestore = inject(Firestore)
  #routineColletion = collection(this.firestore, 'routines')
  routines = toSignal(collectionData(this.#routineColletion) as Observable<DiaperRoutine[]>, {
    initialValue: []
  });

    addRoutine(routine: DiaperRoutine) {
      addDoc(this.#routineColletion,{
        ...routine,
        Timestamp: [Date.now(), 0]
      });
    }
}
