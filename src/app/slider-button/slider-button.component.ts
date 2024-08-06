import { Component, computed, DestroyRef, effect, inject, output, signal, viewChild } from '@angular/core';
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

  popover = viewChild(IonPopover);

  constructor() {
    effect(() => {
      this.selectionChange.emit(this.temperature());
    });

    this.destroyRef.onDestroy(() => {
      this.popover()?.dismiss();
    })
  }

  destroyRef = inject(DestroyRef);

  ionViewWillLeave() {

  }

  temperatureIcon = computed(() => {
    if (this.temperature() < 36.5) {
      return 'assets/svg/temperature-freeze.svg';
    } else if (this.temperature() >= 36.5 && this.temperature() < 36.8) {
      return 'assets/svg/temperature-low.svg';
    } else if (this.temperature() >= 36.8 && this.temperature() <= 37.2) {
      return 'assets/svg/temperature-normal.svg';
    } else if (this.temperature() > 37.2 && this.temperature() <= 37.5) {
      return 'assets/svg/temperature-high.svg';
    } else {
      return 'assets/svg/temperature-burn.svg';
    }
  });

  tempFormatter(value: number) {
    return `${value / 10}`;
  }
}
