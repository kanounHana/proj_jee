import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtudiantEspaceComponent } from './etudiant-espace/etudiant-espace.component';

const routes: Routes = [
  {
    path: '',
    component: EtudiantEspaceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtudiantRoutingModule { }