import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pee-amount-image',
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
export class PeeAmountImageComponent {
  @Input() peeAmount: number = 0;

  get imageSrc(): string {
    if (this.peeAmount === 0) {
      return 'assets/svg/pee-empty.svg';
    } else if (this.peeAmount > 100) {
      return 'assets/svg/pee-full.svg';
    } else {
      return 'assets/svg/pee-half.svg';
    }
  }

  get imageAlt(): string {
    if (this.peeAmount === 0) {
      return 'pee-empty';
    } else if (this.peeAmount > 100) {
      return 'pee-full';
    } else {
      return 'pee-half';
    }
  }
} 