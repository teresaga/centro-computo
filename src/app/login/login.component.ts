import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/service.index';

declare function init_plugins();
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame: Boolean = false;

  constructor( 
    public _usuarioService: UsuarioService,
    public router: Router 
  ) { }

  ngOnInit() {
    init_plugins();

    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1 )
      this.recuerdame =  true;
  }

  ingresar( form: NgForm ) {

    if(form.invalid){
      return;
    }

    let usuario = new Usuario(null, form.value.email, form.value.password);
    //this.router.navigate(['/dashboard']);
    this._usuarioService.login(usuario, form.value.recuerdame)
                        .subscribe( correcto => this.router.navigate(['/dashboard']) );
  }
}
