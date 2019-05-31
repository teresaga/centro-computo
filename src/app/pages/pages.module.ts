import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbModalModule, NgbTooltipModule, NgbCheckBox } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

//Modulos
import { SharedModule } from "../shared/shared.module";

//Rutas
import { PAGES_ROUTES } from "./pages.routes";

//ng2-charts
import { ChartsModule } from 'ng2-charts';

import { PagesComponent } from "./pages.component";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { Graficas1Component } from "./graficas1/graficas1.component";
import { InventarioComponent } from './inventario/inventario.component';
import { PrestamosComponent } from './prestamos/prestamos.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

import { GraficoDonaComponent } from "../components/grafico-dona/grafico-dona.component";
import { SettingComponent } from './setting/setting.component';
import { AddprestamoComponent } from './prestamos/addprestamo/addprestamo.component';
import { AddusuarioComponent } from './usuarios/addusuario/addusuario.component';
import { AddinventarioComponent } from './inventario/addinventario/addinventario.component';
import { AddactividadComponent } from './actividades/addactividad/addactividad.component';

import { FechasPipe } from './pipes/fechas.pipe';

@NgModule({
    declarations:[
        PagesComponent,
        DashboardComponent,
        Graficas1Component,
        GraficoDonaComponent,
        InventarioComponent,
        PrestamosComponent,
        ActividadesComponent,
        UsuariosComponent,
        SettingComponent,
        AddprestamoComponent,
        AddusuarioComponent,
        AddinventarioComponent,
        AddactividadComponent,
        FechasPipe
    ],
    exports: [
        DashboardComponent,
        Graficas1Component,
    ],
    imports: [
        SharedModule,
        PAGES_ROUTES,
        ChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgbModalModule.forRoot(),
        NgbTooltipModule.forRoot()
    ]
})
export class PagesModule {}