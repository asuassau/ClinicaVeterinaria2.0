import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListLineasHistorialesPageRoutingModule } from './list-lineas-historiales-routing.module';

import { ListLineasHistorialesPage } from './list-lineas-historiales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListLineasHistorialesPageRoutingModule
  ],
  declarations: [ListLineasHistorialesPage]
})
export class ListLineasHistorialesPageModule {}
