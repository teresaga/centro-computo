import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InventarioService } from 'src/app/services/service.index';
import { Inventario } from '../../../models/inventario.model';
@Component({
  selector: 'app-addinventario',
  templateUrl: './addinventario.component.html',
  styles: []
})
export class AddinventarioComponent implements OnInit {

  form: FormGroup;

  constructor(
    public _inventarioService: InventarioService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      descripcion: new FormControl(null, Validators.required),
      tipo: new FormControl(null, Validators.required),
      modelo: new FormControl(null),
      serie: new FormControl(null),
      localizacion: new FormControl(null),
      persona: new FormControl(null),
      observaciones: new FormControl(null),
    } );
  }

  registrar(){
    if (this.form.invalid){
      return;
    }
    let estatus;

    if (this.form.value.tipo!="A")
      this.form.get('persona').setValue("");

    if (this.form.value.tipo!="O")
      this.form.get('localizacion').setValue("");
      
    if(this.form.value.tipo=="O"){
      estatus="ND";
    }
    if(this.form.value.tipo=="P" || this.form.value.tipo=="A" ){
      estatus="D";
    }

    if ((this.form.value.tipo=="A" && (this.form.value.persona==null || this.form.value.persona=="")) || (this.form.value.tipo=="O" && (this.form.value.localizacion==null || this.form.value.localizacion==""))){

    }else{
      let inventario = new Inventario(
        this.form.value.descripcion,
        this.form.value.tipo,
        estatus,
        this.form.value.modelo,
        this.form.value.serie,
        this.form.value.localizacion,
        this.form.value.persona,
        null,
        this.form.value.observaciones,
      );

      this._inventarioService.crearInventario(inventario)
            .subscribe( resp => {

            });
    }
  }
}
