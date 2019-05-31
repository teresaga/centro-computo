import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Categoria } from 'src/app/models/categoria.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import swal from 'sweetalert';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  crearServicio(servicio: Categoria){
    let url = URL_SERVICIOS + '/servicio';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, servicio)
                .pipe( 
                    map((resp: any) => {

                      swal('Servicio creado', servicio.nombre, 'success');
                      return resp.inventario;

                    }),
                    catchError( err => {
                      swal(err.error.mensaje, err.error.errors.message, 'error');
                      return throwError( err );
                    })
                );
                    
  }

  cargarServicios( desde: number = 0 ){
    let url = URL_SERVICIOS + '/servicio?desde=' + desde;

    return this.http.get( url );
  }

  cargarTodoServicios( ){
    let url = URL_SERVICIOS + '/servicio/todo';

    return this.http.get( url );
  }

  borrarServicio( id: string ){
    let url = URL_SERVICIOS + '/servicio/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                    .pipe( 
                      map(resp => {
                        swal('Servicio borrado', 'El servicio ha sido eliminado correctamente', 'success');
                        return true;
                      })
                    );
  }

  buscarServicio( termino: string ){
    let url = URL_SERVICIOS + '/busqueda/coleccion/servicio/' + termino;

    return this.http.get( url )
                    .pipe( 
                      map((resp: any) => resp.servicio )
                    );
  }
}
