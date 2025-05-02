import { Routes } from '@angular/router';
import { HomeComponent } from './modules/institucional/home/home.component';
import { adminRoutes } from './modules/admin/admin.routes';
import { TermosDeUsoComponent } from './modules/politicas/termos-de-uso/termos-de-uso.component';
import { PoliticasPrivacidadeComponent } from './modules/politicas/politicas-privacidade/politicas-privacidade.component';
import { ForgotComponent } from './modules/auth/forgot/forgot.component';
import { CartaoComponent } from './modules/estabelecimentos/cartao/cartao.component';
import { CondominiosComponent } from './modules/admin/condominios/condominios.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'admin',
    children: adminRoutes
  },
  {
    path: '',
    component:HomeComponent
  },
  {
    path: 'reset-password',
    component:ForgotComponent
  },
  {
    path: 'empresa/:id/cartao-digital',
    component:CartaoComponent
  },
  {
    path: 'condominio/:id',
    component:CondominiosComponent
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
    path: '**',
    component:NotFoundComponent
  }
];
