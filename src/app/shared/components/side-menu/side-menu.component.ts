import { CommonModule } from '@angular/common';
import { Component, HostBinding, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent {
  menuItems: any[] = [
    /*  {
       title:'Dashboard',
       icon:'./assets/icons/home.svg',
       url:''
     }, */
    {
      title: 'Condomínios',
      icon: 'building',
      url: 'admin/condominios',
    },
    {
      title: 'Empresas',
      icon: 'building-svgrepo-com',
      url: 'admin/empresas',
    },
    {
      title: 'Cidades',
      icon: 'place-marker-svgrepo-com',
      url: 'admin/cidades',
    },
    {
      title: 'Categorias',
      icon: 'list-check',
      url: 'admin/categorias',
    },
    {
      title: 'Subcategorias',
      icon: 'list-ul-alt-1-svgrepo-com',
      url: 'admin/subcategorias',
    },
    {
      title: 'Banners',
      icon: 'announcement-01-svgrepo-com',
      url: 'admin/banners',
    },
    {
      title: 'Planos',
      icon: 'stars-svgrepo-com',
      url: 'admin/planos',
    },
    {
      title: 'Assinaturas',
      icon: 'edit',
      url: 'admin/assinaturas',
    },
    {
      title: 'Lembretes',
      icon: 'announcement-01-svgrepo-com',
      url: 'admin/lembretes',
    },
    {
      title: 'Avisos',
      icon: 'announcement-01-svgrepo-com',
      url: 'admin/avisos',
    },
    {
      title: 'Usuários',
      icon: 'users-svgrepo-com',
      url: 'admin/usuarios',
    },
  ];

  @HostBinding('class.expanded') isOpen = false;

  constructor(public router: Router) {}

  hiddenMenu() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:keydown.escape') closeOnEscape() {
    this.isOpen = false;
  }

  changeScreen(rota: string) {
    this.router.navigate([rota]);
    if (window.matchMedia('(max-width: 767px)').matches) this.isOpen = false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/admin/login']);
  }
}
