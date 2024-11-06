import { Routes } from '@angular/router';

import { toZonedTime, format } from 'date-fns-tz';
import { TabsComponent } from './tabs/tabs.component';

export const getCurrentTimestamp = () => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = new Date();
  const zonedTime = toZonedTime(date, userTimeZone);
  return format(zonedTime, "yyyy-MM-dd'T'HH:mm:ss");
}

export const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'history',
        loadComponent: () => import('./history/history.page').then(m => m.HistoryPage)
      },
      {
        path: 'sleep',
        loadComponent: () => import('./sleep/sleep.page').then(m => m.SleepPage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: 'routine',
    loadComponent: () => import('./routine/routine.page').then(m => m.RoutinePage),
    resolve: {
      timestamp: getCurrentTimestamp
    }
  },
];
