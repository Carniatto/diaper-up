import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'routine',
    pathMatch: 'full',
  },
  {
    path: 'routine',
    loadComponent: () => import('./routine/routine.page').then( m => m.RoutinePage)
  },
];
