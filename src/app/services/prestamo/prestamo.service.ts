import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Prestamo } from 'src/app/models/prestamo.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import swal from 'sweetalert';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  crearPrestamo(prestamo: Prestamo){
    let url = URL_SERVICIOS + '/prestamo';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, prestamo)
                .pipe( 
                    map((resp: any) => {

                      return resp.prestamo;

                    }),
                    catchError( err => {
                      swal(err.error.mensaje, err.error.errors.message, 'error');
                      return throwError( err );
                    })
                );
                    
  }

  editarPrestamo( prestamo: Prestamo ) {

    let url = URL_SERVICIOS + '/prestamo/' + prestamo._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, prestamo )
              .pipe( 
                    map((resp: any) => {

                      swal('Préstamo actualizado', "Préstamo de "+prestamo.nombre, 'success');
                      return resp.prestamo;

                    }),
                    catchError( err => {
                      swal(err.error.mensaje, err.error.errors.message, 'error');
                      return throwError( err );
                    })
                );
  }

  cargarPrestamo( desde: number = 0 ){
    let url = URL_SERVICIOS + '/prestamo?desde=' + desde;

    return this.http.get( url );
  }

  borrarPrestamo( id: string ){
    let url = URL_SERVICIOS + '/prestamo/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                    .pipe( 
                      map(resp => {
                        swal('Préstamo borrado', 'El préstamo ha sido eliminado correctamente', 'success');
                        return true;
                      })
                    );
  }

  buscarPrestamo( termino: string ){
    let url = URL_SERVICIOS + '/busqueda/coleccion/prestamos/' + termino;

    return this.http.get( url )
                    .pipe( 
                      map((resp: any) => resp.prestamos )
                    );
  }

  cargarPrestamoFecha( desde: number = 0, datestart: string, dateend: string ){
    let url = URL_SERVICIOS + '/prestamo/fecha?desde=' + desde+'&datestart='+datestart+'&dateend='+dateend;

    return this.http.get( url );
  }

  cargarPrestamoStatus( status: string ){
    let url = URL_SERVICIOS + '/prestamo/estado?estatus=' + status;

    return this.http.get( url );
  }
}
