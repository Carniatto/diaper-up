import { Component, computed, inject, input, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { IonicModule, ModalController, DatetimeCustomEvent } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Nap } from '../../services/nap.service';
import { addIcons } from 'ionicons';
import { 
  close, 
  sunnyOutline, 
  moonOutline, 
  timeOutline,
  checkmarkCircle,
  bedOutline
} from 'ionicons/icons';
import { differenceInHours, differenceInMinutes, parseISO  } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';

@Component({
  selector: 'app-nap-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './nap-modal.component.html',
  styleUrls: ['./nap-modal.component.scss']
})
export class NapModalComponent implements OnInit {

  modalCtrl = inject(ModalController);

  @Input() title!: string;
  @Input() nap!: Nap<Date>;
  startTime = signal<Date>(new Date());
  endTime = signal<Date>(new Date());
  isNightSleep = signal<boolean>(false);

  duration = computed(() => {
    const start = this.startTime();
    const end = this.endTime();
    if (!start || !end) return '';

    const hours = differenceInHours(end, start);
    const minutes = differenceInMinutes(end, start) % 60;
    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  });

  constructor() {
    addIcons({ 
      close, 
      sunnyOutline, 
      moonOutline, 
      timeOutline,
      checkmarkCircle,
      bedOutline
    });
  }


  ngOnInit() {
    this.startTime.set(this.nap.startTime);
    this.endTime.set(this.nap.endTime);
    this.isNightSleep.set(this.nap.type === 'sleep');
  }

  onTimeChange(event: DatetimeCustomEvent, type: 'start' | 'end') {
    if (!event.detail.value || typeof event.detail.value !== 'string') return;
    const date = parseISO(event.detail.value);
    if (type === 'start') {
      this.startTime.set(date);
    } else {
      this.endTime.set(date);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    const start = this.startTime();
    const end = this.endTime();
    if (!start || !end) return;

    this.modalCtrl.dismiss({
      startTime: start,
      endTime: end,
      type: this.isNightSleep() ? 'sleep' : 'nap'
    });
  }

  formatDisplayTime(date: Date): string {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedTime = toZonedTime(date, userTimeZone);
    return format(zonedTime, "yyyy-MM-dd'T'HH:mm:ss");
  }

  onToggleChange(event: any) {
    this.isNightSleep.set(event.detail.checked);
  }

} 