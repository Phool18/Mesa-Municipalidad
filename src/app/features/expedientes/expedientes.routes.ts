import { Routes } from '@angular/router';
import { ExpedientesListComponent } from './pages/expedientes-list/expedientes-list.component';
import { ExpedienteFormComponent } from './pages/expediente-form/expediente-form.component';

export const EXPEDIENTES_ROUTES: Routes = [
  { path: '', component: ExpedientesListComponent },
  { path: 'nuevo', component: ExpedienteFormComponent },
  { path: 'editar/:id', component: ExpedienteFormComponent },
];
