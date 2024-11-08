import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, IonItemSliding } from '@ionic/angular';
import { NapService, Nap } from '../services/nap.service';
import { UserService } from '../services/user.service';
import { bed, trash, moon, sunny, checkmarkCircle, timeOutline, stopCircle, create } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { computed } from '@angular/core';
import { NapModalComponent } from './nap-modal/nap-modal.component';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { differenceInHours } from 'date-fns/differenceInHours';
import { format } from 'date-fns';

export interface NapPeriod {
  type: 'nap' | 'wake';
  startTime: Date;
  endTime: Date | null;
  duration?: string;
  id?: string;
}

@Component({
  selector: 'app-sleep',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './sleep.page.html',
  styleUrls: ['./sleep.page.scss']
})
export class SleepPage implements OnInit {
  napService = inject(NapService);
  userService = inject(UserService);
  modalCtrl = inject(ModalController);

  periods = computed(() => {
    const naps = this.napService.naps();
    if (!naps?.length) return [];

    const periods: NapPeriod[] = [];
    
    for (let i = 0; i < naps.length; i++) {
      const currentNap = naps[i];
      
      periods.push({
        type: 'nap',
        startTime: currentNap.startTime,
        endTime: currentNap.endTime,
        duration: this.getDuration(currentNap.endTime, currentNap.startTime),
        id: currentNap.id
      });

      if (i < naps.length - 1 && currentNap.endTime) {
        const nextNap = naps[i + 1];
        const wakePeriod: NapPeriod = {
          type: 'wake',
          startTime: nextNap.endTime!,
          endTime: currentNap.startTime,
          duration: this.getDuration(currentNap.startTime, nextNap.endTime)
        };
        periods.push(wakePeriod);
      }
    }

    return periods;
  });

  totalNapTime = computed(() => {
    const naps = this.napService.naps();
    if (!naps?.length) return '0h 0m';

    const totalMinutes = naps.reduce((acc, nap) => {
      if (nap.endTime) {
        return acc + differenceInMinutes(nap.endTime, nap.startTime);
      }
      return acc;
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  });

  constructor() {
    addIcons({ bed, trash, moon, sunny, checkmarkCircle, timeOutline, stopCircle, create });
  }

  ngOnInit() {
    this.loadNaps();
  }

  formatTime(time: Date): string {
    return format(time, 'HH:mm');
  }

  getDuration(endTime: Date, nextStartTime: Date): string {
    const start = new Date(nextStartTime);
    const end = new Date(endTime);
    const hours = differenceInHours(end, start);
    const minutes = differenceInMinutes(end, start) % 60;
    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  }

  async loadNaps() {
    const userId = this.userService.currentUser();
    if (userId) {
      await this.napService.loadTodayNaps(userId);
    }
  }

  async removeNap(napId: string, slidingItem: IonItemSliding) {
    await slidingItem.close();
    const userId = this.userService.currentUser();
    if (userId) {
      await this.napService.remove(napId);
    }
  }
  

  async editNap(period: NapPeriod, slidingItem: IonItemSliding) {
    await slidingItem.close();
    const modal = await this.modalCtrl.create({
      component: NapModalComponent,
      componentProps: {
        nap: {
          id: period.id,
          startTime: period.startTime,
          endTime: period.endTime,
        }
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && period.id) {
      const userId = this.userService.currentUser();
      if (userId) {
        await this.napService.update(period.id, {
          startTime: data.startTime,
          endTime: data.endTime
        });
      }
    }
  }

  async createNap() {
    const modal = await this.modalCtrl.create({
      component: NapModalComponent,
      componentProps: {
        nap: {
          startTime: new Date(),
          endTime: new Date(),
        }
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss<{ startTime: Date, endTime: Date }>();
    if (data) {
      const userId = this.userService.currentUser();
      if (userId) {
        await this.napService.create({
          startTime: data.startTime,
          endTime: data.endTime,
          user: userId
        });
      }
    }
  }
}
