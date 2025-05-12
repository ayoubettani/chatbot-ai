import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
    { 
      path: '', 
      component: LayoutComponent,
      children: [
        { path: '', redirectTo: 'chat', pathMatch: 'full' },
        { path: 'chat', component: ChatComponent },
        { path: 'dashboard', component: ChatComponent }, // Replace with actual Dashboard component when created
        { path: 'profile', component: ChatComponent },   // Replace with actual Profile component when created
        { path: 'settings', component: ChatComponent }   // Replace with actual Settings component when created
      ]
    }
  ];
