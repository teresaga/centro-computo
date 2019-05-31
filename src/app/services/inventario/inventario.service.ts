import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Inventario } from 'src/app/models/inventario.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import swal from 'sweetalert';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  crearInventario(inventario: Inventario){
    let url = URL_SERVICIOS + '/inventario';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, inventario)
                .pipe( 
                    map((resp: any) => {

                      swal('Objeto creado', inventario.descripcion, 'success');
                      return resp.inventario;

                    }),
                    catchError( err => {
                      swal(err.error.mensaje, err.error.errors.message, 'error');
                      return throwError( err );
                    })
                );
                    
  }

  editarInventario( inventario: Inventario ) {

    let url = URL_SERVICIOS + '/inventario/' + inventario._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, inventario )
              .pipe( 
                    map((resp: any) => {

                      return resp.inventario;

                    }),
                    catchError( err => {
                      swal(err.error.mensaje, err.error.errors.message, 'error');
                      return throwError( err );
                    })
                );
  }

  cargarInventario( desde: number = 0 ){
    let url = URL_SERVICIOS + '/inventario?desde=' + desde;

    return this.http.get( url );
  }

  cargarTodoInventario(  ){
    let url = URL_SERVICIOS + '/inventario/todo';

    return this.http.get( url );
  }

  cargarObjeto( id: string ){
    let url = URL_SERVICIOS + '/inventario/' + id;

    return this.http.get( url ).pipe( 
                    map((resp: any) => resp.inventario ));
  }

  borrarInventario( id: string ){
    let url = URL_SERVICIOS + '/inventario/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                    .pipe( 
                      map(resp => {
                        swal('Inventario borrado', 'El objeto ha sido eliminado correctamente', 'success');
                        return true;
                      })
                    );
  }

  buscarInventario( termino: string ){
    let url = URL_SERVICIOS + '/busqueda/coleccion/inventario/' + termino;

    return this.http.get( url )
                    .pipe( 
                      map((resp: any) => resp.inventario )
                    );
  }
  
}
