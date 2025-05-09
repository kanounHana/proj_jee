import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { EtudiantEspaceComponent } from './etudiant/etudiant-espace/etudiant-espace.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] } // Modification ici
  },
  { 
    path: 'etudiant-espace', 
    component: EtudiantEspaceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ETUDIANT'] } // Modification ici
  },
  { 
    path: 'admin', 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  { 
    path: 'etudiant', 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ETUDIANT'] },
    loadChildren: () => import('./etudiant/etudiant.module').then(m => m.EtudiantModule)
  },
 
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }