import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter } from '@ionic/angular/standalone';
import { RoutineService } from '../routine-service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonFooter, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink],
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

}
