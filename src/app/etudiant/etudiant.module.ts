import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtudiantRoutingModule } from './etudiant-routing.module';
import { EtudiantEspaceComponent } from './etudiant-espace/etudiant-espace.component';
import { OffresStageComponent } from './offres-stage/offres-stage.component';
import { OffreDetailsComponent } from './offre-details/offre-details.component';
import { RapportStageComponent } from './rapport-stage/rapport-stage.component';

@NgModule({
  declarations: [
    EtudiantEspaceComponent,
    OffresStageComponent,
    OffreDetailsComponent,
    RapportStageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EtudiantRoutingModule
  ],
  exports: [
    EtudiantEspaceComponent,
    OffresStageComponent,
    RapportStageComponent
  ]
})
export class EtudiantModule { }