import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'

import { 
  SharedService, 
  SidebarService,
  UsuarioService,
  LoginGuardGuard
} from './service.index';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SharedService, 
    SidebarService,
    UsuarioService
  ],
  declarations: []
})
export class ServiceModule { }
