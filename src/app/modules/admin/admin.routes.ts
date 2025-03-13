import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth/auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../admin/admin.component')
      .then(m => m.AdminComponent),
    children: [
      {
        path: '',
        canActivate:[authGuard],
        loadComponent: () => import('../admin/dashboard/dashboard.component')
          .then(m => m.DashboardComponent) // Página principal do admin
      },
      {
        path: 'cidades',
        loadComponent: () => import('../admin/cidades/cidades.component')
          .then(m => m.CidadesComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('../admin/usuarios/usuarios.component')
          .then(m => m.UsuariosComponent)
      },
      {
        path: 'empresas',
        loadComponent: () => import('../admin/empresas/empresas.component')
          .then(m => m.EmpresasComponent)
      },
      {
        path: 'condominios',
        loadComponent: () => import('../admin/condominios/condominios.component')
          .then(m => m.CondominiosComponent)
      },
      {
        path: 'planos',
        loadComponent: () => import('../admin/planos/planos.component')
          .then(m => m.PlanosComponent)
      },
      {
        path: 'banners',
        loadComponent: () => import('../admin/banners/banners.component')
          .then(m => m.BannersComponent)
      },
      {
        path: 'categorias',
        loadComponent: () => import('../admin/categorias/categorias.component')
          .then(m => m.CategoriasComponent)
      },

    ]
  },
  {
    path: 'login',
    loadComponent: () => import('../auth/login/login.component')
      .then(m => m.LoginComponent) // Página principal do admin
  },

];
