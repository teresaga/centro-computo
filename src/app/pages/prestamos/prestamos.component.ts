import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Prestamo } from 'src/app/models/prestamo.model';
import { DetallePrestamo } from 'src/app/models/detalle-prestamo';
import { Inventario } from 'src/app/models/inventario.model';
import { PrestamoService, DetallesPrestamoService, InventarioService } from 'src/app/services/service.index';

declare var swal: any;

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent implements OnInit {
  public busquedaFechaDe = null;
  public busquedaFechaHasta = null;

  prestamos: Prestamo[] = [];
  detallesPrestamo: DetallePrestamo[] = [];
  desde: number = 0;
  totalRegistros: number=0;

  
  //Variables para guardar lista de prestamos
  productosPrestados: any[] = [];

  //Para mostrar datos del equipo
  inv: Inventario[] = [];

  cargando: Boolean = false;

  constructor(
    public _prestamoService: PrestamoService,
    public _detallePrestamoService: DetallesPrestamoService,
    public _inventarioService: InventarioService,
    private modalService: NgbModal,
    public router: Router
  ) { 
  }

  ngOnInit() {
    var date = new Date();
    this.busquedaFechaDe=date.toISOString().slice(0,10);
    this.busquedaFechaHasta=date.toISOString().slice(0,10);
    this.cargarPrestamos();
  }

  cargarPrestamos(){
    this.cargando = true;

    this._prestamoService.cargarPrestamoFecha( this.desde, this.busquedaFechaDe, this.busquedaFechaHasta )
                        .subscribe( (resp: any) => {
                          this.totalRegistros = resp.conteo;
                          this.prestamos = resp.prestamos;

                          if(this.desde >= this.totalRegistros && this.totalRegistros>0){
                            this.desde -= 5;
                            this.cargarPrestamos();
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
    this.cargarPrestamos();
  }

  openModaldetails(content, id: string){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
    this.cargarDetallesPrestamo(id);
  }

  cargarDetallesPrestamo(id){
    this._detallePrestamoService.cargarDetallePrestamo(id)
                                  .subscribe( (resp: any) => {
                                    this.detallesPrestamo = resp.detallesPrestamos;
                                  });
  }

  //Busacar con termino
  buscarPrestamo( termino: string ){

    if ( termino.length <= 0) {
      this.cargarPrestamos();
      return;
    }

    //Se muestra el div que dice "Cargando"
    this.cargando = true;

    this._prestamoService.buscarPrestamo( termino )
                          .subscribe( (prestamos: Prestamo[]) => {
                            
                            this.prestamos = prestamos;
                            this.cargando = false; //Se quita el div "Cargando"

                          });

  }

  borrarPrestamo( prestamo: Prestamo ){

    swal({
      title: '¿Estás seguro?',
      text: 'Estas a punto de borrar el préstamo de ' + prestamo.nombre,
      icon: 'warning',
      dangerMode: true,
      buttons: true
    }).then( borrar => {
      if (borrar){
        this._prestamoService.borrarPrestamo( prestamo._id )
                          .subscribe( borrado => {
                            console.log(borrado);
                            
                            this.cargarPrestamos();
                          });

        this._detallePrestamoService.cargarDetallePrestamo(prestamo._id)
                            .subscribe( (resp: any) => {
                            let detallesPrestamo = resp.detallesPrestamos;

                            for (let detalles of detallesPrestamo){
                              detalles.inventario.estatus="D";
                              this._inventarioService.editarInventario(detalles.inventario).subscribe(
                                resp => {
                                });
                            }
                          });
        
      }
    });


  }

  openModalterminar(content, id: string){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
    this._detallePrestamoService.cargarDetallePrestamo(id)
                                  .subscribe( (resp: any) => {
                                    this.productosPrestados = resp.detallesPrestamos;
                                  });
  }

  cambiarEstadoEntregado(i){
    if (this.productosPrestados[i].inventario.estatus=="O")
      this.productosPrestados[i].inventario.estatus="D";
    else
      this.productosPrestados[i].inventario.estatus="O";
  }

  cambiarTodos(bn: Boolean){
    let estatus = "O";
    if (bn==true){
      estatus = "D";
    }else{
      estatus = "O";
    }
    for (let productos of this.productosPrestados){
      productos.inventario.estatus=estatus;
    }
  }

  registrar(){
    swal({
      title: '¿Estás seguro?',
      text: 'Se terminará el préstamo de ' + this.productosPrestados[0].prestamo.nombre + ' y los equipos/objetos no devueltos se guardarán como "Extraviados"',
      icon: 'warning',
      dangerMode: true,
      buttons: true
    }).then( terminar => {
      if (terminar){
        var date = new Date();
        var fechaSalida = date.toISOString().slice(0,10);

        this.productosPrestados[0].prestamo.estatus="B";
        this.productosPrestados[0].prestamo.fechaSalida=fechaSalida;
        this._prestamoService.editarPrestamo(this.productosPrestados[0].prestamo).subscribe(
          resp => {
            
    this.cargarPrestamos();
          });

        for (let producto of this.productosPrestados){
          if (producto.inventario.estatus=="O"){
            producto.inventario.estatus="E";
            producto.inventario.observaciones=producto.inventario.observaciones+". Se extravió en un préstamo";
          }
          debugger
          console.log(producto);
          this._inventarioService.editarInventario(producto.inventario).subscribe(
            resp => {
            });
        }
      }
    });
    
  }

}
