import { Component, computed, DestroyRef, effect, inject, output, signal, viewChild, input, model } from '@angular/core';
import { IonButton, IonPopover, IonContent, IonRange } from "@ionic/angular/standalone";

interface RangeConfig {
  min?: number;
  max?: number;
  icon: string;
}

@Component({
  selector: 'app-slider-button',
  templateUrl: './slider-button.component.html',
  styleUrls: ['./slider-button.component.scss'],
  imports: [IonRange, IonContent, IonPopover, IonButton],
  standalone: true,
})
export class SliderButtonComponent {
  destroyRef = inject(DestroyRef);
  value = model<number>(0);
  unit = input<string>('');
  defaultValue = input<number>(0);
  rangeConfigs = input<RangeConfig[]>([]);
  defaultIcon = input<string>('');
  step = input<number>(1);
  selectionChange = output<number>();
  popover = viewChild(IonPopover);

  constructor() {
    effect(() => {
      this.selectionChange.emit(this.value());
    });

    this.destroyRef.onDestroy(() => {
      this.popover()?.dismiss();
    })
  }

  presentPopover(e: Event) {
    this.popover()!.event = e;
    this.popover()!.present();
  }

  range = computed(() => {
    const configs = this.rangeConfigs();
    const min = Math.min(...configs.map(c => c.min ?? 0))*10;
    const max = Math.max(...configs.map(c => c.max ?? 0))*10;
    return { min, max };
  });

  currentIcon = computed(() => {
    const currentValue = this.value();
    if (currentValue === 0) {
      return this.defaultIcon();
    }
    return this.rangeConfigs().find(range => 
      (range.min === undefined || currentValue >= range.min) &&
      (range.max === undefined || currentValue <= range.max)
    )?.icon ?? this.defaultIcon();
  });

  valueFormatter(value: number) {
    return `${value / 10}`;
  }
}
