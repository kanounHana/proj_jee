import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtudiantEspaceComponent } from './etudiant-espace/etudiant-espace.component';
import { OffresStageComponent } from './offres-stage/offres-stage.component';
import { OffreDetailsComponent } from './offre-details/offre-details.component';
import { RapportStageComponent } from './rapport-stage/rapport-stage.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: '', component: EtudiantEspaceComponent },
  { path: 'offres', component: OffresStageComponent },
  { path: 'offres/:id', component: OffreDetailsComponent, canActivate: [AuthGuard] },
  { path: 'rapports', component: RapportStageComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtudiantRoutingModule { }