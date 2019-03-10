import { NgModule } from "@angular/core";

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
    ],
    exports: [
        DashboardComponent,
        Graficas1Component,
    ],
    imports: [
        SharedModule,
        PAGES_ROUTES,
        ChartsModule
    ]
})
export class PagesModule {}