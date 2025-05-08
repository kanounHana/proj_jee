import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AjouterOffreComponent } from './ajouter-offre/ajouter-offre.component';
import { ListeOffresComponent } from './liste-offres/liste-offres.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { UserCreateComponent } from './user-form/user-form.component';



const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'ajouter-offre', component: AjouterOffreComponent },
  { path: 'liste-offres', component: ListeOffresComponent },
  {path: 'users', component: UsersListComponent},
  { path: 'users/delete/:id', component: UserDeleteComponent },
  { path: 'users/new', component: UserCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }