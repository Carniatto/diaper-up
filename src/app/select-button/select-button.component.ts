import { Component, computed, input, output, signal, effect } from '@angular/core';
import { IonButton } from "@ionic/angular/standalone";

type ButtonDescriptor = {
  label: string;
  svg: string;
  value: number;
}

@Component({
  selector: 'app-select-button',
  templateUrl: './select-button.component.html',
  styleUrls: ['./select-button.component.scss'],
  imports: [IonButton],
  standalone: true,
})
export class SelectButtonComponent {
  selected = signal<number>(0);
  selectionChange = output<number>();

  constructor() {
    effect(() => {
      this.selectionChange.emit(this.selected());
    });
  }

  selectedValue = computed(() => {
    return this.list()[this.selected()];
  });

  list = input.required<ButtonDescriptor[]>();

  nextValue() {
    const newIndex = (this.selected() + 1) % this.list().length;
    return this.selected.set(newIndex);
  }
}
