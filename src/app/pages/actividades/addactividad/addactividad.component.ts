import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Categoria } from 'src/app/models/categoria.model';
import { Prestamo } from 'src/app/models/prestamo.model';
import { Actividad } from 'src/app/models/actividad.model';
import { CarreraService, GrupoService, ServicioService, ActividadService } from 'src/app/services/service.index';

declare var swal: any;

@Component({
  selector: 'app-addactividad',
  templateUrl: './addactividad.component.html',
  styles: []
})
export class AddactividadComponent implements OnInit {

  form: FormGroup;

  carreras: Categoria[] = [];
  grupos: Categoria[] = [];
  servicios: Categoria[] = [];

  cargando: boolean =  true;

  constructor(
    public _grupoService: GrupoService,
    public _carreraService: CarreraService,
    public _servicioService: ServicioService,
    public _actividadService: ActividadService,
  ) { }

  ngOnInit() {
    this.cargarCategorias();
    this.form = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      cuenta: new FormControl(null),
      carrera: new FormControl(null),
      grupo: new FormControl(null),
      equipo: new FormControl(null),
      marca: new FormControl(null),
      color: new FormControl(null),
      tipoServicio: new FormControl(null, Validators.required),
      observaciones: new FormControl(null)
    } );
  }

  cargarCategorias(){

    this._carreraService.cargarTodoCarreras(  )
                        .subscribe( (resp: any) => this.carreras = resp.carreras );

    this._grupoService.cargarTodoGrupos(  )
                    .subscribe( (resp: any) => this.grupos = resp.grupos );

    this._servicioService.cargarTodoServicios(  )
                    .subscribe( (resp: any) => this.servicios = resp.servicios );
  }

  crearCarrera() {

    swal({
      title: 'Crear carrera',
      text: 'Ingrese el nombre de la carrera',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true
    }).then( (valor: string ) => {

      if ( !valor || valor.length === 0 ) {
        return;
      }

      let carrera = new Categoria(
        valor
      );

      this._carreraService.crearCarrera( carrera )
              .subscribe( () => this.cargarCategorias() );

    });

  }

  crearGrupo() {

    swal({
      title: 'Crear grupo',
      text: 'Ingrese el grupo',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true
    }).then( (valor: string ) => {

      if ( !valor || valor.length === 0 ) {
        return;
      }

      let grupo = new Categoria(
        valor
      );
      
      this._grupoService.crearGrupo( grupo )
              .subscribe( () => this.cargarCategorias() );

    });

  }

  crearServicio() {

    swal({
      title: 'Crear servicio',
      text: 'Ingrese el servicio',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true
    }).then( (valor: string ) => {

      if ( !valor || valor.length === 0 ) {
        return;
      }

      let servicio = new Categoria(
        valor
      );
      
      this._servicioService.crearServicio( servicio )
              .subscribe( () => this.cargarCategorias() );

    });

  }

  registrar(){
    if (this.form.invalid){
      return;
    }
      let actividad = new Actividad(
        this.form.value.nombre,
        this.form.value.tipoServicio,
        this.form.value.cuenta,
        this.form.value.grupo,
        this.form.value.carrera,
        this.form.value.equipo,
        this.form.value.marca,
        this.form.value.color,
        this.form.value.observaciones
      );

      this._actividadService.crearActividad(actividad)
            .subscribe( (resp: any) => {
             
          });
    
  }

}
