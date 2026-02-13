import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListServiciosPageRoutingModule } from './list-servicios-routing.module';

import { ListServiciosPage } from './list-servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListServiciosPageRoutingModule
  ],
  declarations: [ListServiciosPage]
})
export class ListServiciosPageModule {}
