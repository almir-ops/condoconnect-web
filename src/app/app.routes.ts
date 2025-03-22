import { Routes } from '@angular/router';
import { HomeComponent } from './modules/institucional/home/home.component';
import { adminRoutes } from './modules/admin/admin.routes';

export const routes: Routes = [
  {
    path: 'admin',
    children: adminRoutes // Importa as rotas filhas
  },
  {
    path: '',
    component:HomeComponent
  },
  {
    path: 'app',
    component:HomeComponent
  },
  {
    path: '',
    component:HomeComponent
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
];
