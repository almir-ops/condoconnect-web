import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth/auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../admin/admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ), // Página principal do admin
      },
      {
        path: 'cidades',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../admin/cidades/cidades.component').then(
            (m) => m.CidadesComponent
          ),
      },
      {
        path: 'usuarios',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../admin/usuarios/usuarios.component').then(
            (m) => m.UsuariosComponent
          ),
      },
      {
        path: 'empresas',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../admin/empresas/empresas.component').then(
            (m) => m.EmpresasComponent
          ),
      },
      {
        path: 'condominios',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../admin/condominios/condominios.component').then(
            (m) => m.CondominiosComponent
          ),
      },
      {
        path: 'planos',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../admin/planos/planos.component').then(
            (m) => m.PlanosComponent
          ),
      },
      {
        path: 'assinaturas',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../admin/inscricoes/inscricoes.component').then(
            (m) => m.AssinaturasComponent
          ),
      },
      {
        path: 'banners',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../admin/banners/banners.component').then(
            (m) => m.BannersComponent
          ),
      },
      {
        path: 'categorias',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../admin/categorias/categorias.component').then(
            (m) => m.CategoriasComponent
          ),
      },
      {
        path: 'subcategorias',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../admin/subcategorias/subcategorias.component').then(
            (m) => m.SubcategoriasComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../auth/login/login.component').then((m) => m.LoginComponent), // Página principal do admin
  },
];
