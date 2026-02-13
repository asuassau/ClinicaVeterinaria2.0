import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuCatalogoPageRoutingModule } from './menu-catalogo-routing.module';

import { MenuCatalogoPage } from './menu-catalogo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuCatalogoPageRoutingModule
  ],
  declarations: [MenuCatalogoPage]
})
export class MenuCatalogoPageModule {}
