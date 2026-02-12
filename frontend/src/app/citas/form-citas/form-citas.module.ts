import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormCitasPageRoutingModule } from './form-citas-routing.module';

import { FormCitasPage } from './form-citas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormCitasPageRoutingModule
  ],
  declarations: [FormCitasPage]
})
export class FormCitasPageModule {}
