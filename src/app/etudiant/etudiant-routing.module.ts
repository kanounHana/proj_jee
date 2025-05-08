import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtudiantEspaceComponent } from './etudiant-espace/etudiant-espace.component';
import { OffresStageComponent } from './offres-stage/offres-stage.component';

const routes: Routes = [
  {
    path: '',
    component: EtudiantEspaceComponent
  },
  {
    path: 'offres',
    component: OffresStageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtudiantRoutingModule { }