import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditServiciosPageRoutingModule } from './edit-servicios-routing.module';

import { EditServiciosPage } from './edit-servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditServiciosPageRoutingModule
  ],
  declarations: [EditServiciosPage]
})
export class EditServiciosPageModule {}
