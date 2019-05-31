import { Component, OnInit } from '@angular/core';

import { PrestamoService, UsuarioService, InventarioService, ActividadService } from 'src/app/services/service.index';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  actividadesProceso: number=0;
  prestamosProceso: number=0;
  usuarios: number=0;
  inventario: number=0;

  constructor(
    public _prestamoService: PrestamoService,
    public _usuarioService: UsuarioService,
    public _inventarioService: InventarioService,
    public _actividadService: ActividadService
    ) { }

  ngOnInit() {
    this.cargarInventario();
    this.cargarPrestamosProceso();
    this.cargarActividadesProceso();
    this.cargarUsuario();
  }


  cargarActividadesProceso(){

    this._actividadService.cargarActividad(  )
                        .subscribe( (resp: any) => {
                          this.actividadesProceso = resp.conteo;
                        });
  }

  cargarPrestamosProceso(){

    this._prestamoService.cargarPrestamoStatus( 'A' )
                        .subscribe( (resp: any) => {
                          this.prestamosProceso = resp.conteo;
                        });
  }

  cargarInventario(){

    this._inventarioService.cargarInventario( 0 )
                        .subscribe( (resp: any) => {
                          this.inventario = resp.conteo;
                        });
  }

  cargarUsuario(){

    this._usuarioService.cargarUsuarios( 0 )
                        .subscribe( (resp: any) => {
                          this.usuarios= resp.total;
                        });
  }
}
