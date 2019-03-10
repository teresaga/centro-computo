import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const pagesRoutes: Routes = [
    { 
        path: '', 
        component: PagesComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Gráficas' } },
            { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Usuarios' } },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);