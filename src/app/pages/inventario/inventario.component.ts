import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Inventario } from 'src/app/models/inventario.model';
import { InventarioService } from 'src/app/services/service.index';
import { Router } from '@angular/router';

declare var swal: any;
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  form: FormGroup;
  inventarioEdit: Inventario = new Inventario('','','','','','','','','','');

  inventarios: Inventario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;

  cargando: boolean =  true;

  inv: Inventario;

  constructor(
    public _inventarioService: InventarioService,
    private modalService: NgbModal,
    public router: Router
  ) { 
    this.inv =  new Inventario("","","");
  }

  ngOnInit() {
    this.cargarInventario();
    this.form = new FormGroup({
      descripcion: new FormControl(null, Validators.required),
      tipo: new FormControl(null, Validators.required),
      modelo: new FormControl(null),
      serie: new FormControl(null),
      localizacion: new FormControl(null),
      persona: new FormControl(null),
      observaciones: new FormControl(null),
      estado: new FormControl(null),
    } );
  }

  cargarInventario(){
    this.cargando = true;

    this._inventarioService.cargarInventario( this.desde )
                        .subscribe( (resp: any) => {
                          this.totalRegistros = resp.conteo;
                          this.inventarios = resp.inventarios;

                          if(this.desde >= this.totalRegistros && this.totalRegistros>0){
                            this.desde -= 5;
                            this.cargarInventario();
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
    this.cargarInventario();
  }

  buscarInventario( termino: string ){

    if ( termino.length <= 0) {
      this.cargarInventario();
      return;
    }

    //Se muestra el div que dice "Cargando"
    this.cargando = true;

    this._inventarioService.buscarInventario( termino )
                          .subscribe( (inventario: Inventario[]) => {
                            
                            this.inventarios = inventario;
                            this.cargando = false; //Se quita el div "Cargando"

                          });

  }

  borrarInventario( inventario: Inventario ){

    swal({
      title: '¿Estás seguro?',
      text: 'Estas a punto de borrar a ' + inventario.descripcion,
      icon: 'warning',
      dangerMode: true,
      buttons: true
    }).then( borrar => {
      if (borrar){
        this._inventarioService.borrarInventario( inventario._id )
                          .subscribe( borrado => {
                            console.log(borrado);
                            
                            this.cargarInventario();
                          });
      }
    });


  }


  openModaldetails(content, inv: any){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
    this.inv.descripcion = inv.descripcion;
    this.inv.estatus = inv.estatus;
    this.inv.fechaRegistro = inv.fechaRegistro;
    this.inv.localizacion = inv.localizacion;
    this.inv.modelo = inv.modelo;
    this.inv.observaciones = inv.observaciones;
    this.inv.personaAsignacion = inv.personaAsignacion;
    this.inv.serie = inv.serie;
    this.inv.tipo = inv.tipo;
  }

  openModalEdit(content, inv: Inventario){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
    this.inventarioEdit = inv;
    this.form.get('descripcion').setValue(this.inventarioEdit.descripcion);
    this.form.get('tipo').setValue(this.inventarioEdit.tipo);
    this.form.get('modelo').setValue(this.inventarioEdit.modelo);
    this.form.get('serie').setValue(this.inventarioEdit.serie);
    this.form.get('localizacion').setValue(this.inventarioEdit.localizacion);
    this.form.get('persona').setValue(this.inventarioEdit.personaAsignacion);
    this.form.get('observaciones').setValue(this.inventarioEdit.observaciones);
    this.form.get('estado').setValue(this.inventarioEdit.estatus);

  }

  //Editar Inventario
  registrar(){
    if (this.form.invalid){
      return;
    }

    if (this.form.value.tipo!="A")
      this.form.get('persona').setValue("");

    if (this.form.value.tipo!="O")
      this.form.get('localizacion').setValue("");

    if (this.form.value.estado=='ND' && this.form.value.tipo=="A"){
      swal('Error','No puede asignar equipo/objeto que está NO DISPONIBLE','error');
    }else{
    if ((this.form.value.tipo=="A" && (this.form.value.persona==null || this.form.value.persona=="")) || (this.form.value.tipo=="O" && (this.form.value.localizacion==null || this.form.value.localizacion==""))){

    }else{

        this.inventarioEdit.descripcion = this.form.value.descripcion;
        this.inventarioEdit.tipo = this.form.value.tipo;
        this.inventarioEdit.modelo = this.form.value.modelo;
        this.inventarioEdit.serie = this.form.value.serie;
        this.inventarioEdit.localizacion = this.form.value.localizacion;
        this.inventarioEdit.personaAsignacion = this.form.value.persona;
        this.inventarioEdit.observaciones = this.form.value.observaciones;
        this.inventarioEdit.estatus = this.form.value.estado;

        this._inventarioService.editarInventario(this.inventarioEdit)
              .subscribe( resp => {
                  this.cargarInventario();
                  swal('Objeto actualizado', this.inventarioEdit.descripcion, 'success');

              });
      }
    }
  }
}
