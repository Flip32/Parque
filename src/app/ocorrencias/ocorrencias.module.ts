import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OcorrenciasPage } from './ocorrencias.page';

const routes: Routes = [
  {
    path: '',
    component: OcorrenciasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OcorrenciasPage]
})
export class OcorrenciasPageModule {}
