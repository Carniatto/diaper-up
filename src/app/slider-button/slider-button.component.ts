import { Component, computed, effect, output, signal } from '@angular/core';
import { IonButton, IonPopover, IonContent, IonRange } from "@ionic/angular/standalone";

@Component({
  selector: 'app-slider-button',
  templateUrl: './slider-button.component.html',
  styleUrls: ['./slider-button.component.scss'],
  imports: [IonRange, IonContent, IonPopover, IonButton],
  standalone: true,
})
export class SliderButtonComponent {
  temperature = signal<number>(0);

  selectionChange = output<number>();

  constructor() {
    effect(() => {
      this.selectionChange.emit(this.temperature());
    });
  }

  temperatureIcon = computed(() => {
    if (this.temperature() < 36.5) {
      return 'assets/svg/temperature-freeze.svg';
    } else if (this.temperature() >= 36.5 && this.temperature() < 37) {
      return 'assets/svg/temperature-low.svg';
    } else if (this.temperature() === 37) {
      return 'assets/svg/temperature-normal.svg';
    } else if (this.temperature() > 37 && this.temperature() <= 37.5) {
      return 'assets/svg/temperature-high.svg';
    } else {
      return 'assets/svg/temperature-burn.svg';
    }
  });

  tempFormatter(value: number) {
    return `${value / 10}`;
  }
}