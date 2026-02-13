import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormServiciosPageRoutingModule } from './form-servicios-routing.module';

import { FormServiciosPage } from './form-servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormServiciosPageRoutingModule
  ],
  declarations: [FormServiciosPage]
})
export class FormServiciosPageModule {}
