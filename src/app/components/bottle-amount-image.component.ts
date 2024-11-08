import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bottle-amount-image',
  template: `
    <img [src]="imageSrc" [alt]="imageAlt" />
  `,
  styles: [`
    img {
      width: 32px;
      height: 32px;
    }
  `],
  standalone: true
})
export class BottleAmountImageComponent {
  @Input() bottleAmount: number = 0;

  get imageSrc(): string {
    if (this.bottleAmount === 0) {
      return 'assets/svg/bottle-empty.svg';
    } else if (this.bottleAmount > 100) {
      return 'assets/svg/bottle-full.svg';
    } else {
      return 'assets/svg/bottle-half.svg';
    }
  }

  get imageAlt(): string {
    if (this.bottleAmount === 0) {
      return 'bottle-empty';
    } else if (this.bottleAmount > 100) {
      return 'bottle-full';
    } else {
      return 'bottle-half';
    }
  }
} 