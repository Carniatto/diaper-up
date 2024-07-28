import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter } from '@ionic/angular/standalone';
import { RoutineService } from '../routine-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonFooter, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink],
})
export class HomePage {
  routineService = inject(RoutineService);
  totalDiapers = computed(() => {
    return this.routineService.routines().filter(r => r.hasPeed || r.hasPooped).length;
  });
  totalPeed = computed(() => {
    return this.routineService.routines().filter(r => r.hasPeed).length;
  });

}
