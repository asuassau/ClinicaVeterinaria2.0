import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListFacturasPageRoutingModule } from './list-facturas-routing.module';

import { ListFacturasPage } from './list-facturas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListFacturasPageRoutingModule
  ],
  declarations: [ListFacturasPage]
})
export class ListFacturasPageModule {}
