import { Routes } from '@angular/router';
import { HomeComponent } from './modules/institucional/home/home.component';
import { adminRoutes } from './modules/admin/admin.routes';
import { TermosDeUsoComponent } from './modules/politicas/termos-de-uso/termos-de-uso.component';
import { PoliticasPrivacidadeComponent } from './modules/politicas/politicas-privacidade/politicas-privacidade.component';

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
    path: 'termos-de-uso',
    component:TermosDeUsoComponent
  },
  {
    path: 'politicas-privacidade',
    component:PoliticasPrivacidadeComponent
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
];
