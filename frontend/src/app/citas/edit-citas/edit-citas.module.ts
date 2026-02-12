import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCitasPageRoutingModule } from './edit-citas-routing.module';

import { EditCitasPage } from './edit-citas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCitasPageRoutingModule
  ],
  declarations: [EditCitasPage]
})
export class EditCitasPageModule {}
