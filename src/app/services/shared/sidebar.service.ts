import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Préstamos', url: '/prestamos' },
        { titulo: 'Actividades', url: '/actividades' },
        { titulo: 'Inventario', url: '/inventario' },
        { titulo: 'Usuarios', url: '/usuarios' },
      ]
    }
  ];

  constructor() { }
}
