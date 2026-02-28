import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'expedientes',
    loadChildren: () =>
      import('./features/expedientes/expedientes.routes').then((m) => m.EXPEDIENTES_ROUTES),
  },
  { path: '', redirectTo: '/expedientes', pathMatch: 'full' },
  { path: '**', redirectTo: '/expedientes' },
];
