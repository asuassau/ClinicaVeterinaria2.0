import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditLineasFacturasPageRoutingModule } from './edit-lineas-facturas-routing.module';

import { EditLineasFacturasPage } from './edit-lineas-facturas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditLineasFacturasPageRoutingModule
  ],
  declarations: [EditLineasFacturasPage]
})
export class EditLineasFacturasPageModule {}
