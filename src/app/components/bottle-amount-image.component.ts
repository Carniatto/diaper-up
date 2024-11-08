import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-bottle-amount-image',
  template: `
    <img [src]="imageSrc" [alt]="imageAlt" [width]="size()" [height]="size()" />
  `,
  standalone: true
})
export class BottleAmountImageComponent {
  bottleAmount = input<number>(0);
  size = input<number>(32);

  get imageSrc(): string {
    const amount = this.bottleAmount();
    if (amount < 30)  {
      return 'assets/svg/bottle-empty.svg';
    } else if (amount < 70) {
      return 'assets/svg/bottle-quarter.svg';
    } else if (amount < 130) {
      return 'assets/svg/bottle-half.svg';
    } else if (amount < 180) {
      return 'assets/svg/bottle-threequarter.svg';
    } else {
      return 'assets/svg/bottle-half.svg';
    }
  }

  get imageAlt(): string {
    const amount = this.bottleAmount();
    if (amount < 30) {
      return 'bottle-empty';
    } else if (amount < 70) {
      return 'bottle-quarter';
    } else if (amount < 130) {
      return 'bottle-half';
    } else if (amount < 180) {
      return 'bottle-threequarter';
    } else {
      return 'bottle-full';
    }
  }
} 