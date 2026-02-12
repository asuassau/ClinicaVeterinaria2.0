import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListUsuarioPageRoutingModule } from './list-usuario-routing.module';

import { ListUsuarioPage } from './list-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListUsuarioPageRoutingModule
  ],
  declarations: [ListUsuarioPage]
})
export class ListUsuarioPageModule {}
