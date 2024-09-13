import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonButtons, IonIcon, IonModal, IonInput } from '@ionic/angular/standalone';
import { RoutineService } from '../routine-service';
import { UserService } from '../user.service';
import { copy, link, time } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { DatePipe } from '@angular/common';
import { formatDistance, formatRelative } from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonInput, IonModal, IonIcon, IonButtons, IonFooter, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink, DatePipe],
})
export class HomePage {
  routineService = inject(RoutineService);
  userservice = inject(UserService);

  totalDiapers = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0);
    return this.routineService.routines()
      .filter(r => new Date(r.timestamp).getTime() > today.getTime())
      .filter(r => r.hasPeed || r.hasPooped).length;
  });
  totalPeed = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0);
    return this.routineService.routines()
      .filter(r => new Date(r.timestamp).getTime() > today.getTime())
      .filter(r => r.hasPeed).length;
  });

  lastRoutine = computed(() => {
    return this.routineService.routines().filter(r => r.bottleAmount > 0).at(0);
  });

  lastPoopTime = computed(() => {
    const lastPoop = this.routineService.routines().filter(r => r.hasPooped).at(0);
    return {
      time: lastPoop ? formatDistance(new Date(lastPoop.timestamp), Date.now(),) : 'Never',
      poopSvg: lastPoop ? this.poopButttons.find(b => b.value === lastPoop.poopColor)?.svg : 'assets/svg/no-poop-black.svg'
    }
  });

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

  constructor() {
    addIcons({ link, time, copy });
  }

  copyUserId() {
    navigator.clipboard.writeText(this.userservice.currentUser() ?? '');
  }

  linkUser(link: string) {
    this.userservice.saveLink(link);
  }

}
