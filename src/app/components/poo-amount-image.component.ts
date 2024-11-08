import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-poo-amount-image',
  template: `
    <img [src]="imageSrc" [alt]="imageAlt" />
  `,
  standalone: true,
  styles: [`
    img {
      width: 32px;
      height: 32px;
    }
  `]
})
export class PooAmountImageComponent {
  @Input() poopColor: number = 0;

  get imageSrc(): string {
    switch (this.poopColor) {
      case 1:
        return 'assets/svg/poop-pale-yellow.svg';
      case 2:
        return 'assets/svg/poop-beige.svg';
      case 3:
        return 'assets/svg/poop-white-putty.svg';
      case 4:
        return 'assets/svg/poop-gold-yellow.svg';
      case 5:
        return 'assets/svg/poop-bronze-ocre.svg';
      case 6:
        return 'assets/svg/poop-green.svg';
      default:
        return 'assets/svg/no-poop-black.svg';
    }
  }

  get imageAlt(): string {
    switch (this.poopColor) {
      case 1:
        return 'poop-pale-yellow';
      case 2:
        return 'poop-beige';
      case 3:
        return 'poop-white-putty';
      case 4:
        return 'poop-gold-yellow';
      case 5:
        return 'poop-bronze-ocre';
      case 6:
        return 'poop-green';
      default:
        return 'no-poop';
    }
  }
} 