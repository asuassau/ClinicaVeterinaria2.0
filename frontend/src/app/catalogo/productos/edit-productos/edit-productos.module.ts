import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProductosPageRoutingModule } from './edit-productos-routing.module';

import { EditProductosPage } from './edit-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProductosPageRoutingModule
  ],
  declarations: [EditProductosPage]
})
export class EditProductosPageModule {}
