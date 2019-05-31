import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Actividad } from 'src/app/models/actividad.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import swal from 'sweetalert';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService

  ) { }

  crearActividad(actividad: Actividad){
    let url = URL_SERVICIOS + '/actividad';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, actividad)
                .pipe( 
                    map((resp: any) => {

                      swal('Actividad creada', 'Se ha registrado la actividad de '+actividad.nombre, 'success');

                      return resp.actividad;

                    }),
                    catchError( err => {
                      swal(err.error.mensaje, err.error.errors.message, 'error');
                      return throwError( err );
                    })
                );
                    
  }

  editarActividad( actividad: Actividad ) {

    let url = URL_SERVICIOS + '/actividad/' + actividad._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, actividad )
              .pipe( 
                    map((resp: any) => {

                      swal('Actividad actualizado', "Actividad de "+actividad.nombre, 'success');
                      return resp.actividad;

                    }),
                    catchError( err => {
                      swal(err.error.mensaje, err.error.errors.message, 'error');
                      return throwError( err );
                    })
                );
  }

  cargarActividad( desde: number = 0 ){
    let url = URL_SERVICIOS + '/actividad?desde=' + desde;

    return this.http.get( url );
  }

  borrarActividad( id: string ){
    let url = URL_SERVICIOS + '/actividad/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                    .pipe( 
                      map(resp => {
                        swal('Actividad borrado', 'La actividad ha sido eliminada correctamente', 'success');
                        return true;
                      })
                    );
  }

  cargarActividadFecha( desde: number = 0, datestart: string, dateend: string, tipo, estatus?, servicio? ){
    let url = URL_SERVICIOS + '/actividad/fechas?desde=' + desde+'&datestart='+datestart+'&dateend='+dateend+'&tipo='+tipo;
    if(tipo==1){
      url += '&servicio='+servicio;
    }else if (tipo==2){
      url += '&estatus='+estatus;
    }else if (tipo==3){
      url += '&servicio='+servicio;
      url += '&estatus='+estatus;
    }

    return this.http.get( url );
  }
}
