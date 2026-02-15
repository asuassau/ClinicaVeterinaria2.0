import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditHistorialesPageRoutingModule } from './edit-historiales-routing.module';

import { EditHistorialesPage } from './edit-historiales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditHistorialesPageRoutingModule
  ],
  declarations: [EditHistorialesPage]
})
export class EditHistorialesPageModule {}
