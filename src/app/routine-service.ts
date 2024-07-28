import { Injectable, signal } from '@angular/core';

  type DiaperRoutine = {
  hasPeed: boolean;
  hasPooped: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class RoutineService {
    routines = signal<DiaperRoutine[]>([]);

    addRoutine(routine: DiaperRoutine) {
      this.routines.update(routines => [...routines, routine]);
    }
}
