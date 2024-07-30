import { RoutineService } from './../routine-service';
import { Component, OnInit, computed, inject, input, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonItem, IonCheckbox, IonButtons, IonIcon, IonModal, IonDatetimeButton, IonDatetime } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { save } from "ionicons/icons";
import { Router } from '@angular/router';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.page.html',
  styleUrls: ['./routine.page.scss'],
  standalone: true,
  imports: [IonDatetime, IonDatetimeButton, IonModal, IonIcon, IonButtons, IonCheckbox, IonItem, IonLabel, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RoutinePage {

  routineService = inject(RoutineService);
  router = inject(Router);

  timestamp = input<string>();

  poopColor = signal<number>(0);

  hasPeed = signal<boolean>(false);

  selectedPoopColor = computed(() => {
    const foundPoop = this.poopButttons.find(button => button.value === this.poopColor());
    return foundPoop !== undefined ? foundPoop : this.poopButttons[0]!;
  });

  datetimePicker = viewChild(IonDatetime);

  diaperCount = computed(() => {
    return this.routineService.routines().filter(routine => routine.hasPeed || routine.hasPooped
    ).length;
  });

  peeCount = computed(() => {
    return this.routineService.routines().reduce((acc, routine) => {
      return routine.hasPeed ? acc + 1 : acc;
    }, 0);
  });

  poopButttons = [
    {
      label: 'No Poop',
      svg: 'assets/svg/no-poop.svg',
      value: 0,
      abnormal: false
    },
    {
      label: 'Pale Poop',
      svg: 'assets/svg/poop-pale-yellow.svg',
      value: 1,
      abnormal: true
    },
    {
      label: 'Beige Poop',
      svg: 'assets/svg/poop-beige.svg',
      value: 2,
      abnormal: true
    },
    {
      label: 'White Poop',
      svg: 'assets/svg/poop-white-putty.svg',
      value: 3,
      abnormal: true
    },
    {
      label: 'Gold Poop',
      svg: 'assets/svg/poop-gold-yellow.svg',
      value: 4,
      abnormal: false
    },
    {
      label: 'Bronze Poop',
      svg: 'assets/svg/poop-bronze-ocre.svg',
      value: 5,
      abnormal: false
    },
    {
      label: 'Green Poop',
      svg: 'assets/svg/poop-green.svg',
      value: 6,
      abnormal: false
    },


  ]

  constructor() {
    addIcons({ save });

  }

  incrementPoopColor() {
    const newPoopColor = this.poopColor() + 1;
    if (newPoopColor >= this.poopButttons.length) {
      return this.poopColor.set(0);
    }
    return this.poopColor.set(newPoopColor);
  }

  saveRoutine() {
    const dateFromIonDatetime = this.datetimePicker()?.value as string;
    const timestamp = parseISO(dateFromIonDatetime).toUTCString();

    this.routineService.addRoutine({
      hasPeed: this.hasPeed(),
      hasPooped: this.poopColor() !== 0,
      poopColor: this.poopColor(),
      timestamp
    });
    this.router.navigate(['/home']);
  }

}
