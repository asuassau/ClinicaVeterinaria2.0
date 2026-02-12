import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormAnimalesPageRoutingModule } from './form-animales-routing.module';

import { FormAnimalesPage } from './form-animales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormAnimalesPageRoutingModule
  ],
  declarations: [FormAnimalesPage]
})
export class FormAnimalesPageModule {}
