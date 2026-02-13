import { Routes } from '@angular/router';
import { HomeComponent } from './modules/institucional/home/home.component';
import { adminRoutes } from './modules/admin/admin.routes';
import { TermosDeUsoComponent } from './modules/politicas/termos-de-uso/termos-de-uso.component';
import { PoliticasPrivacidadeComponent } from './modules/politicas/politicas-privacidade/politicas-privacidade.component';
import { ForgotComponent } from './modules/auth/forgot/forgot.component';
import { CartaoComponent } from './modules/estabelecimentos/cartao/cartao.component';
import { CondominiosComponent } from './modules/admin/condominios/condominios.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { AssinaturasComponent } from './modules/assinaturas/assinaturas.component';
import { CentralLoginComponent } from './modules/central/central-login.component';
import { CentralLayoutComponent } from './modules/central/central-layout.component';
import { CentralAuthGuard } from './core/guards/auth/central-auth.guard';
import { CentralPerfilComponent } from './modules/central/central-perfil.component';
import { CentralEmpresasComponent } from './modules/central/central-empresas.component';
import { CentralAssinaturasComponent } from './modules/central/central-assinaturas.component';

export const routes: Routes = [
  // ✅ NOVO PORTAL
  { path: '', component: HomeComponent },

  { path: 'central/login', component: CentralLoginComponent },
  {
    path: 'central',
    component: CentralLayoutComponent,
    canActivate: [CentralAuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'assinaturas' },
      { path: 'perfil', component: CentralPerfilComponent },
      { path: 'empresas', component: CentralEmpresasComponent },
      { path: 'assinaturas', component: CentralAssinaturasComponent },
    ],
  },

  // ... mantém tudo como está
  { path: 'assinaturas', component: AssinaturasComponent },
  { path: 'admin', children: adminRoutes },
  { path: 'reset-password', component: ForgotComponent },
  { path: 'empresa/:id/cartao-digital', component: CartaoComponent },
  { path: 'condominio/:id', component: CondominiosComponent },
  { path: 'app', component: HomeComponent },
  { path: 'termos-de-uso', component: TermosDeUsoComponent },
  { path: 'politicas-privacidade', component: PoliticasPrivacidadeComponent },
  { path: '**', component: NotFoundComponent },
];
