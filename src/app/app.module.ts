import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { authInterceptorProviders, AuthInterceptor } from './interceptors/jwt-interceptor.service';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RapportsEtudiantsComponent } from './rapports/rapports-etudiants/rapports-etudiants.component';
import { HomeComponent } from './home/home.component';

/*const routes: Routes = [
  { path: 'login', component: LoginComponent },
  //{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
*/
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
    
    //LoginComponent
    //DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    LoginComponent,
    HttpClientModule,
    RapportsEtudiantsComponent,
    AppRoutingModule
  ],
  providers: [
    authInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }