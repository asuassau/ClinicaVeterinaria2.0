import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAnimalesPageRoutingModule } from './edit-animales-routing.module';

import { EditAnimalesPage } from './edit-animales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAnimalesPageRoutingModule
  ],
  declarations: [EditAnimalesPage]
})
export class EditAnimalesPageModule {}
