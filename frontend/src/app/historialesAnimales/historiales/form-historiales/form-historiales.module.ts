import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormHistorialesPageRoutingModule } from './form-historiales-routing.module';

import { FormHistorialesPage } from './form-historiales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormHistorialesPageRoutingModule
  ],
  declarations: [FormHistorialesPage]
})
export class FormHistorialesPageModule {}
