import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  menuItems: any[] = [
    /*  {
       title:'Dashboard',
       icon:'./assets/icons/home.svg',
       url:''
     }, */
     {
       title:'Condominios',
       icon:'building',
       url:'admin/condominios',
      },
      {
        title:'Empresas',
        icon:'building-svgrepo-com',
        url:'admin/empresas',
    },
    {
      title:'Cidades',
      icon:'place-marker-svgrepo-com',
      url:'admin/cidades',
    },
    {
      title:'Categorias',
      icon:'list-check',
      url:'admin/categorias',
    },
    {
      title:'SubCategorias',
      icon:'list-ul-alt-1-svgrepo-com',
      url:'admin/subcategorias',
    },
    {
      title:'Banners',
      icon:'announcement-01-svgrepo-com',
      url:'admin/banners',
    },
    {
      title:'Planos',
      icon:'stars-svgrepo-com',
      url:'admin/planos',
    },
    {
      title:'Usuarios',
      icon:'users-svgrepo-com',
      url:'admin/usuarios',
    }
   ]

   open: any = 'w-0 md:w-16 -ml-2 md:ml-0 lg:flex lg:flex-col';

   isOpen: any = false;

   title: string = '';

   @ViewChild('search') searchElement!: ElementRef;

   constructor(
     private router: Router,
   ) {}

   ngOnInit(): void {

   }

   hiddenMenu() {
     if (this.isOpen) {
       this.open = 'w-0 md:w-16';
     }
     if (!this.isOpen) {
       this.open = 'w-60';
     }
     this.isOpen = !this.isOpen;
   }

   showMenu() {
     if (!this.isOpen) {
       this.open = 'w-60';
       this.isOpen = !this.isOpen;
     }
   }

   searchFocus() {
     setTimeout(() => {
       this.searchElement.nativeElement.focus();
     }, 0);
   }

   changeScreen(rota: any) {
     console.log(rota);
     this.router.navigate([rota]);
   }

   handleInput(event: Event) {
     this.title = (event.target as HTMLInputElement).value;
   }

   logout(){
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(['/admin/login']);
   }
}
