import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser = signal<string | null>(null);
  init() {
    const user = localStorage.getItem('user');
    if (user) {
      return this.currentUser.set(user);
    }
    const newUser = crypto.randomUUID();
    localStorage.setItem('user', newUser);
    return this.currentUser.set(newUser);
  }
}
