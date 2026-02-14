import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditLineasHistorialesPageRoutingModule } from './edit-lineas-historiales-routing.module';

import { EditLineasHistorialesPage } from './edit-lineas-historiales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditLineasHistorialesPageRoutingModule
  ],
  declarations: [EditLineasHistorialesPage]
})
export class EditLineasHistorialesPageModule {}
