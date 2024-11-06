import { inject, Injectable, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { user } from '@angular/fire/auth';
import { limitToFirst } from '@angular/fire/database';
import { addDoc, arrayUnion, collection, Firestore, updateDoc, getDocs, query, where, limit, collectionData } from '@angular/fire/firestore';
import { map, switchMap, tap } from 'rxjs';


type UserLink = {
  user: string;
  links: string[];
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  firestore = inject(Firestore);
  currentUser = signal<string | null>(null);

  #userLinksCollection = collection(this.firestore, 'user-links');

  constructor() {
    this.init();
  }

  init() {
    const user = localStorage.getItem('user');
    if (user) {
      return this.currentUser.set(user);
    }
    const newUser = crypto.randomUUID();
    localStorage.setItem('user', newUser);
    return this.currentUser.set(newUser);
  }

  getUserLinks() {
    return toObservable(this.currentUser).pipe(
      tap(user => console.log('user', user)),
      switchMap(user => collectionData(
        query(
          this.#userLinksCollection,
          where("user", "==", user),
        )
      ).pipe(
        tap(data => console.log('data', data)),
        map((data) => {
        return (data?.[0]?.['links'] ?? []) as string[];
      }))
      )
    );

  }

  async saveLink(link: string) {
    const userLink = await getDocs(
      query(
        this.#userLinksCollection,
        where('user', '==', this.currentUser()),
        limit(1)
      )
    );
    if (userLink.empty) {
      await addDoc(this.#userLinksCollection, {
        user: this.currentUser(),
        links: [link]
      });
    }
    updateDoc(userLink.docs[0].ref, {
      links: arrayUnion(link)
    });
  }
}
