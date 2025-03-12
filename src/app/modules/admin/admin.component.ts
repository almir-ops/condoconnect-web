import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from '../../shared/components/side-menu/side-menu.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule,SideMenuComponent],
  template: `
  <div class="flex bg-gray-100 h-screen w-screen">
    <app-side-menu></app-side-menu>
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 20px;
    }
    nav a {
      margin: 10px;
      text-decoration: none;
      font-weight: bold;
      color: blue;
    }
    main {
      width: 80%;
      margin-top: 20px;
    }
  `]
})
export class AdminComponent {}
