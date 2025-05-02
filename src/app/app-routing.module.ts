import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { EtudiantEspaceComponent } from './etudiant/etudiant-espace/etudiant-espace.component';

const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent) 
  }, 
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' }
  },
  { 
    path: 'etudiant-espace', 
    component: EtudiantEspaceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ETUDIANT' }
  }]//,
  /*
  // Routes protégées par AuthGuard (nécessitent une authentification)
  { 
    path: 'dashboard', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) 
  },
  { 
    path: 'rapport-stage', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./rapport-stage/rapport-stage.module').then(m => m.RapportStageModule) 
  },
  { 
    path: 'demande-stage', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./demande-stage/demande-stage.module').then(m => m.DemandeStageModule) 
  },
  { 
    path: 'entreprises', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./entreprises/entreprises.module').then(m => m.EntreprisesModule) 
  },
  
  // Redirection par défaut
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
*/
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }