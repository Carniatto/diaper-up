import { RoutineService } from './../routine-service';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonItem, IonCheckbox, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { save } from "ionicons/icons";
import { Router } from '@angular/router';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.page.html',
  styleUrls: ['./routine.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButtons, IonCheckbox, IonItem, IonLabel, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RoutinePage {

  routineService = inject(RoutineService);
  router = inject(Router);

  diaperCount = computed(() => {
    return this.routineService.routines().filter(routine => routine.hasPeed || routine.hasPooped
    ).length;
  });

  peeCount = computed(() => {
    return this.routineService.routines().reduce((acc, routine) => {
      return routine.hasPeed ? acc + 1 : acc;
    }, 0);
  });

  constructor() {
    addIcons({ save });
  }

  saveRoutine(pee: boolean, poop: boolean) {
    this.routineService.addRoutine({
      hasPeed: pee,
      hasPooped: poop
    });
    this.router.navigate(['/home']);
  }

}
