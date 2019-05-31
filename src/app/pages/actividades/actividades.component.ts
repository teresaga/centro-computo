import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Actividad } from 'src/app/models/actividad.model';
import { Categoria } from 'src/app/models/categoria.model';
import { ActividadService, ServicioService, CarreraService, GrupoService } from 'src/app/services/service.index';

declare var swal: any;

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit {
  form: FormGroup;
  actividadEdit: any ;

  public busquedaFechaDe: string = "1";
  public busquedaFechaHasta: string = "1";
  public servicio: string = "1";
  public estatus: string = "1";

  actividades: Actividad[] = [];
  carreras: Categoria[] = [];
  grupos: Categoria[] = [];
  servicios: Categoria[] = [];
  desde: number = 0;
  totalRegistros: number=0;

  cargando: Boolean = false;

  
  actividad: Actividad;

  constructor(
    public _actividadService: ActividadService,
    public _carreraService: CarreraService,
    public _grupoService: GrupoService,
    public _servicioService: ServicioService,
    private modalService: NgbModal,
    public router: Router
  ) {
    this.actividad =  new Actividad("","","");
   }

  ngOnInit() {
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
    var date = new Date();
    this.busquedaFechaDe=date.toISOString().slice(0,10);
    this.busquedaFechaHasta=date.toISOString().slice(0,10);
    this.cargarCategorias();
    this.cargarActividades();
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

  cargarActividades(){
    this.cargando = true;

    if (this.servicio=="1" && this.estatus=="1"){
      this._actividadService.cargarActividadFecha( this.desde, this.busquedaFechaDe, this.busquedaFechaHasta, 0 )
                          .subscribe( (resp: any) => {
                            this.totalRegistros = resp.conteo;
                            this.actividades = resp.actividades;

                            if(this.desde >= this.totalRegistros && this.totalRegistros>0){
                              this.desde -= 5;
                              this.cargarActividades();
                            }

                            this.cargando = false;
                          });
    }else if (this.servicio!="1" && this.estatus=="1"){
      this._actividadService.cargarActividadFecha( this.desde, this.busquedaFechaDe, this.busquedaFechaHasta, 1, null, this.servicio )
                          .subscribe( (resp: any) => {
                            this.totalRegistros = resp.conteo;
                            this.actividades = resp.actividades;

                            if(this.desde >= this.totalRegistros && this.totalRegistros>0){
                              this.desde -= 5;
                              this.cargarActividades();
                            }

                            this.cargando = false;
                          });
    }else if (this.servicio=="1" && this.estatus!="1"){
      this._actividadService.cargarActividadFecha( this.desde, this.busquedaFechaDe, this.busquedaFechaHasta, 2, this.estatus, null )
                          .subscribe( (resp: any) => {
                            this.totalRegistros = resp.conteo;
                            this.actividades = resp.actividades;

                            if(this.desde >= this.totalRegistros && this.totalRegistros>0){
                              this.desde -= 5;
                              this.cargarActividades();
                            }

                            this.cargando = false;
                          });
    }else{
      this._actividadService.cargarActividadFecha( this.desde, this.busquedaFechaDe, this.busquedaFechaHasta, 3, this.estatus, this.servicio )
                          .subscribe( (resp: any) => {
                            this.totalRegistros = resp.conteo;
                            this.actividades = resp.actividades;

                            if(this.desde >= this.totalRegistros && this.totalRegistros>0){
                              this.desde -= 5;
                              this.cargarActividades();
                            }

                            this.cargando = false;
                          });
    }
  }

  cambiarDesde( valor: number ){
    let desde = this.desde + valor;

    if ( desde >= this.totalRegistros )
      return;

    if ( desde < 0 ) 
      return;
     
    this.desde += valor;
    this.cargarActividades();
  }

  openModaldetails(content, actividad: any){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
    this.actividad.nombre = actividad.nombre;
    this.actividad.cuentaEstudiante = actividad.cuentaEstudiante;
    this.actividad.carrera = actividad.carrera;
    this.actividad.grupo = actividad.grupo;
    this.actividad.estatus = actividad.estatus;
    this.actividad.fechaEntrada = actividad.fechaEntrada;
    this.actividad.fechaSalida = actividad.fechaSalida;
    this.actividad.observaciones = actividad.observaciones;
    this.actividad.equipo = actividad.equipo;
    this.actividad.color = actividad.color;
    this.actividad.marca = actividad.marca;
    this.actividad.tipoServicio = actividad.tipoServicio;
  }

  openModalEdit(content, actividad: Actividad){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
    this.actividadEdit = actividad;
    this.form.get('nombre').setValue(this.actividadEdit.nombre);
    this.form.get('cuenta').setValue(this.actividadEdit.cuentaEstudiante);
    this.form.get('carrera').setValue(this.actividadEdit.carrera._id);
    this.form.get('grupo').setValue(this.actividadEdit.grupo._id);
    this.form.get('tipoServicio').setValue(this.actividadEdit.tipoServicio._id);
    this.form.get('equipo').setValue(this.actividadEdit.equipo);
    this.form.get('marca').setValue(this.actividadEdit.marca);
    this.form.get('color').setValue(this.actividadEdit.color);
    this.form.get('observaciones').setValue(this.actividadEdit.observaciones);

  }

  borrarActividad( actividad: Actividad ){

    swal({
      title: '¿Estás seguro?',
      text: 'Estas a punto de borrar la actividad seleccionada',
      icon: 'warning',
      dangerMode: true,
      buttons: true
    }).then( borrar => {
      if (borrar){
        this._actividadService.borrarActividad( actividad._id )
                          .subscribe( borrado => {
                            console.log(borrado);
                            
                            this.cargarActividades();
                          });
      }
    });


  }

  activarActividad( actividad: Actividad ){

    swal({
      title: '¿Estás seguro?',
      text: 'Estas a punto de INICIAR la actividad seleccionada',
      icon: 'warning',
      dangerMode: true,
      buttons: true
    }).then( borrar => {
      if (borrar){
        actividad.estatus="P";
        this._actividadService.editarActividad( actividad )
                          .subscribe( borrado => {
                            console.log(borrado);
                            
                            this.cargarActividades();
                          });
      }
    });


  }

  terminarActividad( actividad: Actividad ){

    swal({
      title: '¿Estás seguro?',
      text: 'Estas a punto de TERMINAR la actividad seleccionada',
      icon: 'warning',
      dangerMode: true,
      buttons: true
    }).then( borrar => {
      if (borrar){
        actividad.estatus="F";
        var date = new Date();
        var fecha =date.toISOString().slice(0,10);
        actividad.fechaSalida=fecha;
        this._actividadService.editarActividad( actividad )
                          .subscribe( borrado => {
                            console.log(borrado);
                            
                            this.cargarActividades();
                          });
      }
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
        this.form.value.observaciones,
        this.actividadEdit.fechaEntrada,
        this.actividadEdit.fechaSalida,
        this.actividadEdit.estatus,
        this.actividadEdit._id
      );

      this._actividadService.editarActividad(actividad)
            .subscribe( (resp: any) => {
              this.cargarActividades();             
          });
    
  }
}
