import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { SettingComponent } from './setting/setting.component';
import { InventarioComponent } from './inventario/inventario.component';
import { PrestamosComponent } from './prestamos/prestamos.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { AddprestamoComponent } from './prestamos/addprestamo/addprestamo.component';
import { AddusuarioComponent } from './usuarios/addusuario/addusuario.component';
import { AddactividadComponent } from './actividades/addactividad/addactividad.component';
import { AddinventarioComponent } from './inventario/addinventario/addinventario.component';

import { LoginGuardGuard } from '../services/service.index';

const pagesRoutes: Routes = [
    { 
        path: '', 
        component: PagesComponent,
        //canActivate: [LoginGuardGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Gráficas' } },
            { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Usuarios' } },
            { path: 'add-usuario', component: AddusuarioComponent, data: { titulo: 'Agregar usuario' } },
            { path: 'inventario', component: InventarioComponent, data: { titulo: 'Inventario' } },
            { path: 'add-inventario', component: AddinventarioComponent, data: { titulo: 'Agregar inventario' } },
            { path: 'prestamos', component: PrestamosComponent, data: { titulo: 'Préstamos' } },
            { path: 'add-prestamo', component: AddprestamoComponent, data: { titulo: 'Agregar préstamo' } },
            { path: 'actividades', component: ActividadesComponent, data: { titulo: 'Actividades' } },
            { path: 'add-actividad', component: AddactividadComponent, data: { titulo: 'Agregar actividad' } },
            { path: 'setting', component: SettingComponent, data: { titulo: 'Cambiar contraseña' } },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);