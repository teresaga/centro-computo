import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { DetallePrestamo  } from 'src/app/models/detalle-prestamo';
import { URL_SERVICIOS } from 'src/app/config/config';
import swal from 'sweetalert';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class DetallesPrestamoService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  crearDetallePrestamo(detalleprestamo: DetallePrestamo){
    let url = URL_SERVICIOS + '/detalle-prestamo';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, detalleprestamo)
                .pipe( 
                    map((resp: any) => {

                      return resp.detalleprestamo;

                    }),
                    catchError( err => {
                      swal(err.error.mensaje, err.error.errors.message, 'error');
                      return throwError( err );
                    })
                );
                    
  }

  cargarDetallePrestamo( prestamo: string ){
    let url = URL_SERVICIOS + '/detalle-prestamo?prestamo=' + prestamo;

    return this.http.get( url );
  }

}
