import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormLineasHistorialesPageRoutingModule } from './form-lineas-historiales-routing.module';

import { FormLineasHistorialesPage } from './form-lineas-historiales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormLineasHistorialesPageRoutingModule
  ],
  declarations: [FormLineasHistorialesPage]
})
export class FormLineasHistorialesPageModule {}
