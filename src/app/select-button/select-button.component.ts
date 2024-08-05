import { Component, computed, input, signal } from '@angular/core';
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

  selectedValue = computed(() => {
    return this.list()[this.selected()];
  });

  list = input.required<ButtonDescriptor[]>();

  nextValue() {
    const newIndex = (this.selected() + 1) % this.list().length;
    return this.selected.set(newIndex);
  }
}
