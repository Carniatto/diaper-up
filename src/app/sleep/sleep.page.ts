import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NapService, Nap } from '../services/nap.service';
import { UserService } from '../services/user.service';
import { bed, trash, moon, sunny, checkmarkCircle, timeOutline, stopCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { computed } from '@angular/core';

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
        duration: currentNap.endTime ? this.getDuration(currentNap) : undefined,
        id: currentNap.id
      });

      if (i < naps.length - 1 && currentNap.endTime) {
        const nextNap = naps[i + 1];
        const wakePeriod: NapPeriod = {
          type: 'wake',
          startTime: nextNap.endTime!,
          endTime: currentNap.startTime,
          duration: this.getWakeDuration(nextNap.endTime!, currentNap.startTime)
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

    let totalMinutes = 0;
    naps.forEach(nap => {
      if (nap.endTime) {
        const diff = new Date(nap.endTime).getTime() - new Date(nap.startTime).getTime();
        totalMinutes += Math.floor(diff / 60000);
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  });

  constructor() {
    addIcons({ bed, trash, moon, sunny, checkmarkCircle, timeOutline, stopCircle });
  }

  ngOnInit() {
    this.loadNaps();
  }

  formatTime(timeString: string): string {
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getWakeDuration(endTime: string, nextStartTime: string): string {
    const diff = new Date(nextStartTime).getTime() - new Date(endTime).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}m`;
    }
    return `${hours}h ${remainingMinutes}m`;
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

  async deleteNap(napId: string) {
    const userId = this.userService.currentUser();
    if (userId) {
      await this.napService.deleteNap(napId, userId);
    }
  }

  getDuration(nap: Nap): string {
    if (!nap.endTime) return '';
    const diff = new Date(nap.endTime).getTime() - new Date(nap.startTime).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}m`;
    }
    return `${hours}h ${remainingMinutes}m`;
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
}
