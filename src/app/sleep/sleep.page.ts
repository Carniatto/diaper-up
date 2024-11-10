import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, IonItemSliding } from '@ionic/angular';
import { NapService, Nap } from '../services/nap.service';
import { UserService } from '../services/user.service';
import {
  bed,
  trash,
  moon,
  sunny,
  checkmarkCircle,
  timeOutline,
  stopCircle,
  create,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { computed } from '@angular/core';
import { NapModalComponent } from './nap-modal/nap-modal.component';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { differenceInHours } from 'date-fns/differenceInHours';
import { format, isAfter, isBefore, set, setHours } from 'date-fns';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';
import { DurationPipe } from '../pipes/duration.pipe';

export interface NapPeriod {
  type: 'nap' | 'sleep' | 'wake';
  startTime: Date;
  endTime: Date;
  duration: number;
  isOngoing?: boolean;
  tomorrow?: boolean;
  id?: string;
}

@Component({
  selector: 'app-sleep',
  standalone: true,
  imports: [IonicModule, CommonModule, DurationPipe],
  templateUrl: './sleep.page.html',
  styleUrls: ['./sleep.page.scss'],
})
export class SleepPage implements OnInit {
  napService = inject(NapService);
  userService = inject(UserService);
  modalCtrl = inject(ModalController);

  currentDate = toSignal(interval(60000).pipe(map(() => new Date())), {
    initialValue: new Date(),
  });

  periods = computed(() => {
    const naps = this.napService.naps();
    if (!naps?.length) return [];

    const todayMidDay = set(new Date(), { hours: 12, minutes: 0 });
    const periods: NapPeriod[] = [];

    for (let i = 0; i < naps.length; i++) {
      const currentNap = naps[i];

      periods.push({
        type: currentNap.type,
        startTime: currentNap.startTime,
        endTime: currentNap.endTime,
        duration: differenceInMinutes(currentNap.endTime, currentNap.startTime),
        id: currentNap.id,
        tomorrow: isAfter(currentNap.startTime, todayMidDay),
        isOngoing:
          currentNap.startTime.getTime() === currentNap.endTime.getTime(),
      });

      if (i < naps.length - 1 && currentNap.endTime) {
        const nextNap = naps[i + 1];
        const wakePeriod: NapPeriod = {
          type: 'wake',
          startTime: nextNap.endTime!,
          endTime: currentNap.startTime,
          duration: differenceInMinutes(currentNap.startTime, nextNap.endTime),
        };
        periods.push(wakePeriod);
      }
    }

    if (
      naps.length > 0 &&
      naps[0].startTime.getTime() !== naps[0].endTime.getTime()
    ) {
      const wakePeriod: NapPeriod = {
        type: 'wake',
        startTime: naps[0].endTime,
        endTime: this.currentDate(),
        duration: differenceInMinutes(this.currentDate(), naps[0].endTime),
      };
      periods.unshift(wakePeriod);
    }

    return periods;
  });

  totalNapTime = computed(() => {
    const naps = this.napService.naps();
    if (!naps?.length) return { totalNapTime: 0, totalSleepTime: 0 };
    const todayMidDay = set(new Date(), { hours: 12, minutes: 0 });
    const totalNapTime = naps.reduce(
      (acc, nap) => {
        if (nap.type === 'nap') {
          acc.totalNapTime += differenceInMinutes(nap.endTime, nap.startTime);
        } else if (isBefore(nap.startTime, todayMidDay)) {
          acc.totalSleepTime += differenceInMinutes(nap.endTime, nap.startTime);
        }
        return acc;
      },
      { totalNapTime: 0, totalSleepTime: 0 }
    );

    return totalNapTime;
  });

  napOngoing = computed(() => {
    const naps = this.napService.naps();
    if (!naps?.length) return false;
    return this.periods().some((period) => period.isOngoing);
  });

  constructor() {
    addIcons({
      bed,
      trash,
      moon,
      sunny,
      checkmarkCircle,
      timeOutline,
      stopCircle,
      create,
    });
  }

  ngOnInit() {
    this.loadNaps();
  }

  formatTime(time: Date): string {
    return format(time, 'HH:mm');
  }

  getDuration(startTime: Date, endTime: Date): string {
    const hours = differenceInHours(endTime, startTime);
    const minutes = differenceInMinutes(endTime, startTime) % 60;
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

  async createNap() {
    const modal = await this.modalCtrl.create({
      component: NapModalComponent,
      componentProps: {
        title: 'Create Nap',
        nap: {
          startTime: new Date(),
          endTime: new Date(),
          type: 'nap',
        },
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss<Omit<Nap<Date>, 'id'>>();
    if (data) {
      const userId = this.userService.currentUser();
      if (userId) {
        await this.napService.create({
          startTime: data.startTime,
          endTime: data.startTime,
          user: userId,
          type: data.type,
        });
      }
    }
  }

  async editNap(period: NapPeriod, slidingItem: IonItemSliding) {
    await slidingItem.close();
    const isOngoing = period.startTime.getTime() === period.endTime.getTime();
    const modal = await this.modalCtrl.create({
      component: NapModalComponent,
      componentProps: {
        title: 'Edit Nap',
        nap: {
          id: period.id,
          startTime: period.startTime,
          endTime: isOngoing ? new Date() : period.endTime,
          type: period.type,
        },
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss<Omit<Nap<Date>, 'id'>>();
    if (data && period.id) {
      const userId = this.userService.currentUser();
      if (userId) {
        await this.napService.update(period.id, {
          startTime: data.startTime,
          endTime: data.endTime,
          type: data.type,
        });
      }
    }
  }
}
