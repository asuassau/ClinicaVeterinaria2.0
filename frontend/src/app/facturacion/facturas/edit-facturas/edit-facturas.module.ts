import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditFacturasPageRoutingModule } from './edit-facturas-routing.module';

import { EditFacturasPage } from './edit-facturas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditFacturasPageRoutingModule
  ],
  declarations: [EditFacturasPage]
})
export class EditFacturasPageModule {}
