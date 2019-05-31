import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Usuario } from 'src/app/models/usuario.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router
  ) { 
    this.cargarStorage();
  }

  estaLogueado(){
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage(){
    if ( localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }else{
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario){
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logout(){
    this.token = '';
    this.usuario = null;
    
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  login(usuario: Usuario, recordar: boolean = false){
    if(recordar)
      localStorage.setItem('email', usuario.email);
    else
      localStorage.removeItem('email');
    
    let url = URL_SERVICIOS + '/login';

    return this.http.post(url, usuario)
                .pipe( 
                    map((resp: any) => {

                      this.guardarStorage(resp.id, resp.token, resp.usuario);
                      
                      return true;

                    }),
                    catchError( err => {
                      swal('Error en el login', err.error.mensaje, 'error');
                      return throwError( err );
                    })
                );
                    
  }

  crearUsuario(usuario: Usuario){
    let url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario)
                .pipe( 
                    map((resp: any) => {

                      swal('Usuario creado', usuario.email, 'success');
                      return resp.usuario;

                    }),
                    catchError( err => {
                      swal(err.error.mensaje, err.error.errors.message, 'error');
                      return throwError( err );
                    })
                );
                    
  }

  editarUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario/password/' + this.usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario )
              .pipe( 
                    map((resp: any) => {

                      swal('Usuario actualizado', usuario.nombre, 'success');
                      return resp.usuario;

                    }),
                    catchError( err => {
                      swal(err.error.mensaje, err.error.errors.message, 'error');
                      return throwError( err );
                    })
                );
  }

  cargarUsuarios( desde: number = 0 ){
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get( url );

  }

  buscarUsuarios( termino: string ){
    let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this.http.get( url )
                    .pipe( 
                      map((resp: any) => resp.usuarios )
                    );
  }

  borrarUsuario( id: string ){
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete( url )
                    .pipe( 
                      map(resp => {
                        swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
                        return true;
                      })
                    );
  }
}
