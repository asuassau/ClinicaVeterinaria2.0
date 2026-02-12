import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditUsuarioPageRoutingModule } from './edit-usuario-routing.module';

import { EditUsuarioPage } from './edit-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditUsuarioPageRoutingModule
  ],
  declarations: [EditUsuarioPage]
})
export class EditUsuarioPageModule {}
