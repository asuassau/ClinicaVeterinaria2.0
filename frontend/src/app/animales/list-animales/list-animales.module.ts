import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListAnimalesPageRoutingModule } from './list-animales-routing.module';

import { ListAnimalesPage } from './list-animales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListAnimalesPageRoutingModule
  ],
  declarations: [ListAnimalesPage]
})
export class ListAnimalesPageModule {}