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
export class CarreraService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  crearCarrera(carrera: Categoria){
    let url = URL_SERVICIOS + '/carrera';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, carrera)
                .pipe( 
                    map((resp: any) => {

                      swal('Carrera creado', carrera.nombre, 'success');
                      return resp.inventario;

                    }),
                    catchError( err => {
                      swal(err.error.mensaje, err.error.errors.message, 'error');
                      return throwError( err );
                    })
                );
                    
  }

  cargarCarreras( desde: number = 0 ){
    let url = URL_SERVICIOS + '/carrera?desde=' + desde;

    return this.http.get( url );
  }

  cargarTodoCarreras(  ){
    let url = URL_SERVICIOS + '/carrera/todo';

    return this.http.get( url );
  }

  borrarCarrera( id: string ){
    let url = URL_SERVICIOS + '/carrera/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                    .pipe( 
                      map(resp => {
                        swal('Carrera borrado', 'La carrera ha sido eliminado correctamente', 'success');
                        return true;
                      })
                    );
  }

  buscarCarrera( termino: string ){
    let url = URL_SERVICIOS + '/busqueda/coleccion/carrera/' + termino;

    return this.http.get( url )
                    .pipe( 
                      map((resp: any) => resp.carrera )
                    );
  }
}
