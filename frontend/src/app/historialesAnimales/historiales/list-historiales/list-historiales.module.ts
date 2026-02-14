import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListHistorialesPageRoutingModule } from './list-historiales-routing.module';

import { ListHistorialesPage } from './list-historiales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListHistorialesPageRoutingModule
  ],
  declarations: [ListHistorialesPage]
})
export class ListHistorialesPageModule {}
