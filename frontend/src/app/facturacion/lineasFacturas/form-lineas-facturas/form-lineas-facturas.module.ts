import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormLineasFacturasPageRoutingModule } from './form-lineas-facturas-routing.module';

import { FormLineasFacturasPage } from './form-lineas-facturas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormLineasFacturasPageRoutingModule
  ],
  declarations: [FormLineasFacturasPage]
})
export class FormLineasFacturasPageModule {}
