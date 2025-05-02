import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtudiantRoutingModule } from './etudiant-routing.module';
import { EtudiantEspaceComponent } from './etudiant-espace/etudiant-espace.component';


@NgModule({
  declarations: [
    EtudiantEspaceComponent
  ],
  imports: [
    CommonModule,
    EtudiantRoutingModule
  ]
})
export class EtudiantModule { }
