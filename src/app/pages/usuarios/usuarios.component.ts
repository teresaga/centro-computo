import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import { shallowEqualArrays } from '@angular/router/src/utils/collection';

declare var swal: any;
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;

  cargando: boolean =  true;

  constructor(
    public _usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios(){
    this.cargando = true;

    this._usuarioService.cargarUsuarios( this.desde )
                        .subscribe( (resp: any) => {
                          this.totalRegistros = resp.total;
                          this.usuarios = resp.usuarios;

                          if(this.desde >= this.totalRegistros && this.totalRegistros>0){
                            this.desde -= 5;
                            this.cargarUsuarios();
                          }

                          this.cargando = false;
                        });
  }

  cambiarDesde( valor: number ){
    let desde = this.desde + valor;

    if ( desde >= this.totalRegistros )
      return;

    if ( desde < 0 ) 
      return;
     
    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ){

    if ( termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    //Se muestra el div que dice "Cargando"
    this.cargando = true;

    this._usuarioService.buscarUsuarios( termino )
                          .subscribe( (usuarios: Usuario[]) => {
                            
                            this.usuarios = usuarios;
                            this.cargando = false; //Se quita el div "Cargando"

                          });

  }

  borrarUsuario( usuario: Usuario ){

    if ( usuario._id === this._usuarioService.usuario._id ){
      swal('No puede borrar usuario', 'No se puede borrar a sí mismo', 'error');
      return;
    }

    swal({
      title: '¿Estás seguro?',
      text: 'Estas a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      dangerMode: true,
      buttons: true
    }).then( borrar => {
      if (borrar){
        this._usuarioService.borrarUsuario( usuario._id )
                          .subscribe( borrado => {
                            console.log(borrado);
                            
                            this.cargarUsuarios();
                          });
      }
    });


  }
}
