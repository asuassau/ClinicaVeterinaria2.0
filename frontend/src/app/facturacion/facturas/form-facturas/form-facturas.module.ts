import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormFacturasPageRoutingModule } from './form-facturas-routing.module';

import { FormFacturasPage } from './form-facturas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormFacturasPageRoutingModule
  ],
  declarations: [FormFacturasPage]
})
export class FormFacturasPageModule {}
