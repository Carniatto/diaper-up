import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, IonItemSliding } from '@ionic/angular';
import { NapService, Nap } from '../services/nap.service';
import { UserService } from '../services/user.service';
import { bed, trash, moon, sunny, checkmarkCircle, timeOutline, stopCircle, create } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { computed } from '@angular/core';
import { EditNapModalComponent } from './edit-nap-modal/edit-nap-modal.component';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { differenceInHours } from 'date-fns/differenceInHours';

export interface NapPeriod {
  type: 'nap' | 'wake';
  startTime: string;
  endTime?: string;
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
        duration: currentNap.endTime ? this.getDuration(currentNap.endTime, currentNap.startTime) : undefined,
        id: currentNap.id
      });

      if (i < naps.length - 1 && currentNap.endTime) {
        const nextNap = naps[i + 1];
        const wakePeriod: NapPeriod = {
          type: 'wake',
          startTime: nextNap.endTime!,
          endTime: currentNap.startTime,
          duration: this.getDuration(currentNap.startTime, nextNap.endTime!)
        };
        periods.push(wakePeriod);
      }
    }

    return periods;
  });

  hasOngoingNap = computed(() => {
    const naps = this.napService.naps();
    return naps && naps.length > 0 && !naps[0].endTime;
  });

  totalNapTime = computed(() => {
    const naps = this.napService.naps();
    if (!naps?.length) return '0h 0m';

    const totalMinutes = naps.reduce((acc, nap) => {
      if (nap.endTime) {
        return acc + differenceInMinutes(new Date(nap.endTime), new Date(nap.startTime));
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

  formatTime(timeString: string): string {
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  }

  getDuration(endTime: string, nextStartTime: string): string {
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

  async startNap() {
    const userId = this.userService.currentUser();
    if (userId) {
      await this.napService.startNap(userId);
    }
  }

  async endNap(napId?: string) {
    const userId = this.userService.currentUser();
    if (userId) {
      await this.napService.endNap(userId);
    }
  }

  async deleteNap(napId: string, slidingItem: IonItemSliding) {
    await slidingItem.close();
    const userId = this.userService.currentUser();
    if (userId) {
      await this.napService.deleteNap(napId, userId);
    }
  }

  async toggleNap() {
    const userId = this.userService.currentUser();
    if (!userId) return;

    if (this.hasOngoingNap()) {
      await this.endNap();
    } else {
      await this.startNap();
    }
  }

  async editNap(period: NapPeriod, slidingItem: IonItemSliding) {
    await slidingItem.close();
    const modal = await this.modalCtrl.create({
      component: EditNapModalComponent,
      componentProps: {
        nap: {
          id: period.id,
          startTime: period.startTime,
          endTime: period.endTime,
          user: this.userService.currentUser()
        }
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && period.id) {
      const userId = this.userService.currentUser();
      if (userId) {
        await this.napService.editNap(period.id, userId, data.startTime, data.endTime);
      }
    }
  }
}
