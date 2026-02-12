import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCitasPageRoutingModule } from './list-citas-routing.module';

import { ListCitasPage } from './list-citas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListCitasPageRoutingModule
  ],
  declarations: [ListCitasPage]
})
export class ListCitasPageModule {}
