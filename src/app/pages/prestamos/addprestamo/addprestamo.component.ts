import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Categoria } from 'src/app/models/categoria.model';
import { Inventario } from 'src/app/models/inventario.model';
import { Prestamo } from 'src/app/models/prestamo.model';
import { CarreraService, GrupoService, InventarioService, PrestamoService, DetallesPrestamoService } from 'src/app/services/service.index';
import { DetallePrestamo } from 'src/app/models/detalle-prestamo';

declare var swal: any;

@Component({
  selector: 'app-addprestamo',
  templateUrl: './addprestamo.component.html',
  styles: []
})
export class AddprestamoComponent implements OnInit {

  form: FormGroup;

  carreras: Categoria[] = [];
  grupos: Categoria[] = [];
  inventario: Inventario[] = [];

  //Variables para guardar lista de prestamos
  productosPrestados: Array<Inventario> = [];

  //Para mostrar datos del equipo
  inv: Inventario;

  cargando: boolean =  true;

  constructor(
    private modalService: NgbModal,
    public _grupoService: GrupoService,
    public _carreraService: CarreraService,
    public _inventarioService: InventarioService,
    public _prestamoService: PrestamoService,
    public _detallesPrestamoService: DetallesPrestamoService,
  ) { 
    this.inv =  new Inventario("","","");
  }

  ngOnInit() {
    this.cargarCategorias();
    this.cargarInventario();
    this.form = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      cuenta: new FormControl(null),
      carrera: new FormControl(null),
      grupo: new FormControl(null),
      idProducto: new FormControl(null)
    } );
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

  cargarCategorias(){

    this._carreraService.cargarTodoCarreras(  )
                        .subscribe( (resp: any) => this.carreras = resp.carreras );

    this._grupoService.cargarTodoGrupos(  )
                    .subscribe( (resp: any) => this.grupos = resp.grupos );
  }

  cargarInventario(){
    this._inventarioService.cargarTodoInventario(  )
                    .subscribe( (resp: any) => this.inventario = resp.inventario );
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

  agregarEquipo(){
    let id: string = this.form.value.idProducto;

    this._inventarioService.cargarObjeto(id)
                  .subscribe( (resp: any) => {
                    this.cargando = false;

                    this.productosPrestados.push({ 
                                              descripcion: resp.descripcion, 
                                              tipo: resp.tipo,
                                              estatus: resp.estatus,
                                              modelo: resp.modelo,
                                              serie: resp.serie,
                                              localizacion: resp.localizacion,
                                              personaAsignacion: resp.personaAsignacion,
                                              fechaRegistro: resp.fechaRegistro,
                                              observaciones: resp.observaciones,
                                              _id: resp._id
                                            });

                    //Quitar equipo de combo box para no seleccionarlo 2 veces
                    var i = this.inventario.findIndex(x => x._id == id);
                    if ( i !== -1 ) {
                        this.inventario.splice( i, 1 );
                    }

                  });
  }


  eliminarProducto(i){
    this.inventario.push(this.productosPrestados[i]);
    this.productosPrestados.splice(i,1); 
  }
  
  registrar(){
    if (this.form.invalid){
      return;
    }
    if (this.productosPrestados.length>0){
      let prestamo = new Prestamo(
        this.form.value.nombre,
        this.form.value.cuenta,
        this.form.value.grupo,
        this.form.value.carrera
      );

      this._prestamoService.crearPrestamo(prestamo)
            .subscribe( (resp: any) => {
              let prestamo = resp;
              for (let producto of this.productosPrestados) {
                
                let detallePrestamo = new DetallePrestamo(
                  producto._id,
                  prestamo._id
                );
                
                this._detallesPrestamoService.crearDetallePrestamo(detallePrestamo).subscribe(
                  resp => {
                  });

                  //Cambiar estatus de productos a Ocupados
                producto.estatus = "O";
                this._inventarioService.editarInventario(producto).subscribe(
                  resp => {
                  });

              }
              
              this.cancelarVenta();
              swal('Préstamo creado', 'Se ha registrado el préstamo de '+prestamo.nombre, 'success');
          });
    }else{
        swal('Error', 'Agregar equipos/objetos al préstamo', 'error');
    }
  }

  cancelarVenta(){
    this.form.reset();
    
    this.productosPrestados.splice(0,this.productosPrestados.length);
  }
}
