import { Component } from '@angular/core';
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { cloudyNight, home, time } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [IonIcon, IonTabButton, IonTabs, IonTabBar]
})
export class TabsComponent {

  constructor() {
    addIcons({ home, time, cloudyNight });
  }

}
