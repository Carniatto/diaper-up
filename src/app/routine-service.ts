
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Firestore, collectionData, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable, switchMap } from 'rxjs';
import { UserService } from './user.service';
import { user } from '@angular/fire/auth';

type DiaperRoutine = {
  hasPeed: boolean;
  hasPooped: boolean;
  poopColor: number;
  peeAmount: number;
  timestamp: string;
  temperature: number;
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
      switchMap(links =>
        collectionData(
          query(
            this.#routineColletion,
            where("user", "in", [this.userservice.currentUser(), ...links])
          )
        ) as Observable<DiaperRoutine[]>
      )
    ), { initialValue: [] }
  );


  addRoutine(routine: DiaperRoutine) {
    addDoc(this.#routineColletion, {
      ...routine,
      user: this.userservice.currentUser()
    });
  }
}
