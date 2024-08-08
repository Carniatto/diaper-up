import { IonPopover } from '@ionic/angular/standalone';
import { RoutineService } from './../routine-service';
import { Component, OnInit, computed, inject, input, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonItem, IonCheckbox, IonButtons, IonIcon, IonModal, IonDatetimeButton, IonDatetime } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { save } from "ionicons/icons";
import { Router } from '@angular/router';
import { format, parseISO } from 'date-fns';
import { SelectButtonComponent } from "../select-button/select-button.component";
import { SliderButtonComponent } from "../slider-button/slider-button.component";

@Component({
  selector: 'app-routine',
  templateUrl: './routine.page.html',
  styleUrls: ['./routine.page.scss'],
  standalone: true,
  imports: [IonDatetime, IonDatetimeButton, IonModal, IonIcon, IonButtons, IonCheckbox, IonItem, IonLabel, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SelectButtonComponent, SliderButtonComponent]
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

  bottleButtons = [
    {
      label: 'No Bottle',
      svg: 'assets/svg/bottle-empty.svg',
      value: 0,
      abnormal: false
    },
    {
      label: 'Half Bottle',
      svg: 'assets/svg/bottle-half.svg',
      value: 1,
      abnormal: true
    },
    {
      label: 'Full Bottle',
      svg: 'assets/svg/bottle-full.svg',
      value: 2,
      abnormal: true
    },
  ]

  constructor() {
    addIcons({ save });
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
