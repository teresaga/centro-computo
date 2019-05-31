import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert';
import { UsuarioService } from 'src/app/services/service.index';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styles: []
})
export class SettingComponent implements OnInit {

  form: FormGroup;

  constructor( 
    public _usuarioService: UsuarioService,
  ) { }

  passwordIguales(campo1: string, campo2: string){
    return (group: FormGroup) => {
      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if(pass1 === pass2) {
        return null;
      }

      return { sonIguales: true }

    };

  }

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
    }, { validators: this.passwordIguales('password', 'password2') } );
  }

  registrar(){
    if (this.form.invalid){
      return;
    }

    let usuario = new Usuario(
      this._usuarioService.usuario.nombre,
      this._usuarioService.usuario.email,
      this.form.value.password,
      this._usuarioService.usuario.role
    );

    this._usuarioService.editarUsuario(usuario)
          .subscribe( resp => {

          });
  }

}
