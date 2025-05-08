import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AjouterOffreComponent } from './ajouter-offre/ajouter-offre.component';
import { ListeOffresComponent } from './liste-offres/liste-offres.component';
import { AdminRoutingModule } from './admin-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { UserCreateComponent } from './user-form/user-form.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AjouterOffreComponent,
    ListeOffresComponent
    
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AdminRoutingModule,
    UsersListComponent,
    UserCreateComponent,
    UserDeleteComponent
    
  ],
  exports: [
    AdminDashboardComponent,
    AjouterOffreComponent,
    //ListeOffresComponent
  ]
})
export class AdminModule { }