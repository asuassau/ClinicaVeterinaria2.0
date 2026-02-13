import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListProductosPageRoutingModule } from './list-productos-routing.module';

import { ListProductosPage } from './list-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListProductosPageRoutingModule
  ],
  declarations: [ListProductosPage]
})
export class ListProductosPageModule {}
