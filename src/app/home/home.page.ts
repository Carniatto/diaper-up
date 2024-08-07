import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonButtons, IonIcon, IonModal, IonInput } from '@ionic/angular/standalone';
import { RoutineService } from '../routine-service';
import { UserService } from '../user.service';
import { copy, link } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { DatePipe } from '@angular/common';

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
    return this.routineService.routines().at(0);
  });

  constructor() {
    addIcons({ link, copy });
  }

  copyUserId() {
    navigator.clipboard.writeText(this.userservice.currentUser() ?? '');
  }

  linkUser(link: string) {
    this.userservice.saveLink(link);
  }

}
