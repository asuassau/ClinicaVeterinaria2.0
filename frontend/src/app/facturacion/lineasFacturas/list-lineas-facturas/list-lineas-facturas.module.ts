import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListLineasFacturasPageRoutingModule } from './list-lineas-facturas-routing.module';

import { ListLineasFacturasPage } from './list-lineas-facturas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListLineasFacturasPageRoutingModule
  ],
  declarations: [ListLineasFacturasPage]
})
export class ListLineasFacturasPageModule {}
