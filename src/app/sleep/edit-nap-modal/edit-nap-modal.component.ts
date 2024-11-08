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
  checkmarkCircle
} from 'ionicons/icons';
import { differenceInHours, differenceInMinutes, parseISO  } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';

@Component({
  selector: 'app-edit-nap-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './edit-nap-modal.component.html',
  styleUrls: ['./edit-nap-modal.component.scss']
})
export class EditNapModalComponent implements OnInit {

  modalCtrl = inject(ModalController);

  @Input() nap!: Nap;
  startTime = signal<Date | null>(null);
  endTime = signal<Date | null>(null);

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
      checkmarkCircle
    });
  }


  ngOnInit() {
    const start = new Date(this.nap.startTime);
    this.startTime.set(start);
    if (this.nap.endTime) {
      const end = new Date(this.nap.endTime);
      this.endTime.set(end);
    }
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
      startTime: start.toUTCString(),
      endTime: end.toUTCString()
    });
  }

  formatDisplayTime(date: Date | null): string {
    if (!date) return '';
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedTime = toZonedTime(date, userTimeZone);
    return format(zonedTime, "yyyy-MM-dd'T'HH:mm:ss");
  } 
} 