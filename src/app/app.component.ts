import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { UserService } from './services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [IonApp, IonRouterOutlet]
})
export class AppComponent {
  constructor() {
    inject(UserService).init();
  }

}
