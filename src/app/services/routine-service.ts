
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, orderBy, query, Timestamp, updateDoc, where } from '@angular/fire/firestore';
import { startOfDay, subDays } from 'date-fns';
import { map, switchMap, tap } from 'rxjs';
import { UserService } from './user.service';

type DiaperRoutine = {
  id?: string;
  hasPeed: boolean;
  hasPooped: boolean;
  poopColor: number;
  peeAmount: number;
  bottleAmount: number;
  temperature: number;
  timestamp: string;
}
@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  firestore = inject(Firestore)

  userservice = inject(UserService);
  #routineColletion = collection(this.firestore, 'routines')

  routines = toSignal(
    this.userservice.getUserLinks().pipe(
      tap(links => console.log('links', links)),
      switchMap(links =>
        collectionData(
          query(
            this.#routineColletion,
            where("user", "in", [this.userservice.currentUser(), ...links]),
            where('timestamp', '>=', Timestamp.fromDate(startOfDay(subDays(new Date(), 1)))),
            orderBy('timestamp')
          ), { idField: 'id' }
        ).pipe(
          tap(routines => console.log('routines', routines)),
          map(routines => routines.map(r => ({
            ...r,
            timestamp: r['timestamp'].toDate().toUTCString()
          }) as DiaperRoutine))
        )
      ),
    ), { initialValue: []}
  );


  addRoutine(routine: DiaperRoutine) {
    addDoc(this.#routineColletion, {
      ...routine,
      timestamp: Timestamp.fromDate(new Date(routine.timestamp)),
      user: this.userservice.currentUser()
    });
  }

  deleteRoutine(routine: DiaperRoutine) {
    const routineRef = doc(this.#routineColletion, routine.id);
    deleteDoc(routineRef);
  }

  updateRoutine(routine: DiaperRoutine) {
    const routineRef = doc(this.#routineColletion, 'timestamp', routine.timestamp);
    updateDoc(routineRef, {
      ...routine,
      timestamp: Timestamp.fromDate(new Date(routine.timestamp)),
      user: this.userservice.currentUser()
    });
  }
}
function subtract(arg0: Date, arg1: { days: number; }): Date {
  throw new Error('Function not implemented.');
}

