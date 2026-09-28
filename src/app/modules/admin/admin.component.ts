import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from '../../shared/components/side-menu/side-menu.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule,SideMenuComponent],
  template: `
  <div class="flex h-screen w-screen overflow-hidden bg-gray-100">
    <app-side-menu class="shrink-0"></app-side-menu>
    <div class="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
      <router-outlet></router-outlet>
    </div>
  </div>
  `,
})
export class AdminComponent {}
