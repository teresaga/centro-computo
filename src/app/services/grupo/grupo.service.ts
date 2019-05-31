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
export class GrupoService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  crearGrupo(grupo: Categoria){
    let url = URL_SERVICIOS + '/grupo';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, grupo)
                .pipe( 
                    map((resp: any) => {

                      swal('Grupo creado', grupo.nombre, 'success');
                      return resp.inventario;

                    }),
                    catchError( err => {
                      swal(err.error.mensaje, err.error.errors.message, 'error');
                      return throwError( err );
                    })
                );
                    
  }

  cargarGrupos( desde: number = 0 ){
    let url = URL_SERVICIOS + '/grupo?desde=' + desde;

    return this.http.get( url );
  }

  cargarTodoGrupos(  ){
    let url = URL_SERVICIOS + '/grupo/todo';

    return this.http.get( url );
  }

  borrarGrupo( id: string ){
    let url = URL_SERVICIOS + '/grupo/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                    .pipe( 
                      map(resp => {
                        swal('Grupo borrado', 'El grupo ha sido eliminado correctamente', 'success');
                        return true;
                      })
                    );
  }

  buscarGrupo( termino: string ){
    let url = URL_SERVICIOS + '/busqueda/coleccion/grupo/' + termino;

    return this.http.get( url )
                    .pipe( 
                      map((resp: any) => resp.grupo )
                    );
  }
}
