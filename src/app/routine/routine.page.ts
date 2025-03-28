import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { parseISO } from 'date-fns';
import { addIcons } from 'ionicons';
import { close, save } from "ionicons/icons";
import { SelectButtonComponent } from "../select-button/select-button.component";
import { RoutineService } from '../services/routine-service';
import { SliderButtonComponent } from "../slider-button/slider-button.component";

@Component({
    selector: 'app-routine',
    templateUrl: './routine.page.html',
    styleUrls: ['./routine.page.scss'],
    imports: [IonDatetime, IonDatetimeButton, IonModal, IonIcon, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SelectButtonComponent, SliderButtonComponent]
})
export class RoutinePage {

  routineService = inject(RoutineService);
  router = inject(Router);

  timestamp = input<string>();

  poopColor = signal<number>(0);

  peeAmount = signal<number>(0);

  temperature = signal<number>(0);

  bottleAmount = signal<number>(0);



  selectedPoopColor = computed(() => {
    const foundPoop = this.poopButttons.find(button => button.value === this.poopColor());
    return foundPoop !== undefined ? foundPoop : this.poopButttons[0]!;
  });

  datetimePicker = viewChild(IonDatetime);

  poopButttons = [
    {
      label: 'No Poop',
      svg: 'assets/svg/no-poop-black.svg',
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
  peeButttons = [
    {
      label: 'No Pee',
      svg: 'assets/svg/pee-empty.svg',
      value: 0,
      abnormal: false
    },
    {
      label: 'Half Pee',
      svg: 'assets/svg/pee-half.svg',
      value: 1,
      abnormal: true
    },
    {
      label: 'Full Pee',
      svg: 'assets/svg/pee-full.svg',
      value: 2,
      abnormal: true
    },
  ]


  back() {
    this.router.navigate(['/home']);
  }

  constructor() {
    addIcons({ save, close });
  }

  saveRoutine() {
    const dateFromIonDatetime = this.datetimePicker()?.value as string;
    const timestamp = parseISO(dateFromIonDatetime).toUTCString();

    this.routineService.addRoutine({
      hasPooped: this.poopColor() > 0,
      poopColor: this.poopColor(),
      hasPeed: this.peeAmount() > 0,
      peeAmount: this.peeAmount(),
      bottleAmount: this.bottleAmount(),
      temperature: this.temperature(),
      timestamp
    });
    this.router.navigate(['/home']);
  }

}
