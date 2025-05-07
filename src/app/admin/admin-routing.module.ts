import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AjouterOffreComponent } from './ajouter-offre/ajouter-offre.component';
import { ListeOffresComponent } from './liste-offres/liste-offres.component';



const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'ajouter-offre', component: AjouterOffreComponent },
  { path: 'liste-offres', component: ListeOffresComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }