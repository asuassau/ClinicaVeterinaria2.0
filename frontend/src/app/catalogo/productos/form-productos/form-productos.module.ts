import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormProductosPageRoutingModule } from './form-productos-routing.module';

import { FormProductosPage } from './form-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormProductosPageRoutingModule
  ],
  declarations: [FormProductosPage]
})
export class FormProductosPageModule {}
