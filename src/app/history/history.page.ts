import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RoutineService } from '../services/routine-service';
import { addDays, differenceInDays, endOfDay, format, formatDistanceToNow, formatRelative, startOfDay, subDays } from 'date-fns';
import { arrowBack, arrowForward, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PeeAmountImageComponent } from "../components/pee-amount-image.component";
import { PooAmountImageComponent } from "../components/poo-amount-image.component";
import { BottleAmountImageComponent } from "../components/bottle-amount-image.component";

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonList, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PeeAmountImageComponent, PooAmountImageComponent, BottleAmountImageComponent]
})
export class HistoryPage {
  routineService = inject(RoutineService);

  selectedDate = signal<Date>(endOfDay(new Date()));

  daysFromToday = computed(() => differenceInDays(startOfDay(new Date()), startOfDay(this.selectedDate())));

  nextDisabled = computed(() => this.daysFromToday() <= 0);
  prevDisabled = computed(() => {
    const ealiestDate = new Date(this.routineService.routines().at(0)?.timestamp!);
    return differenceInDays(startOfDay(this.selectedDate()), startOfDay(ealiestDate)) <= 0;
  });

  selectedDateRelative = computed(() => {
    if (this.daysFromToday() < 2) {
      return formatRelative(this.selectedDate(), new Date()).split(' at')[0];
    }
    return format(this.selectedDate(), 'E, do MMM');
  });

  selectedDatePrev = computed(() => endOfDay(subDays(this.selectedDate(), 1)));

  routines = computed(() => this.routineService.routines().toReversed().filter(routine => {
    const routineDate = new Date(routine.timestamp);
    return routineDate.getTime() <= this.selectedDate().getTime() && routineDate.getTime() > this.selectedDatePrev().getTime();
  }));

  summary = computed(() => {
    return this.routines().reduce((acc, routine) => {
      acc['pee'] = acc['pee'] + routine.peeAmount / 2;
      acc['poo'] = routine.hasPooped ? acc['poo'] + 1 : acc['poo'];
      acc['bottle'] = acc['bottle'] + routine.bottleAmount;
      return acc;
    }, { pee: 0, poo: 0, bottle: 0 });
  });

  constructor() {
    addIcons({ arrowBack, arrowForward, trash });
  }

  prevDay() {
    this.selectedDate.update(sDate => subDays(sDate, 1));
  }

  nextDay() {
    this.selectedDate.update(sDate => addDays(sDate, 1));
  }

}
