import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { IonApp, IonRouterOutlet, IonContent } from '@ionic/angular/standalone';
import { Database, ref, list } from "@angular/fire/database";
import { JsonPipe } from '@angular/common';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonContent, IonApp, IonRouterOutlet, JsonPipe],
})
export class AppComponent {
  constructor() {
    inject(UserService).init();
  }

}
