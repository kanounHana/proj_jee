import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    // Récupérer le rôle requis depuis les données de la route
    const requiredRole = route.data['role'] as string;
    
    // Si aucun rôle requis n'est spécifié, autoriser l'accès
    if (!requiredRole) {
      return true;
    }
    
    // Vérifier si l'utilisateur a le rôle requis
    const userRole = this.authService.getUserRole();
    if (userRole === requiredRole) {
      return true;
    } else {
      // IMPORTANT : Vérifier qu'on ne redirige pas vers la même route
      // pour éviter les boucles infinies
      let targetRoute = '';
      if (userRole === 'ADMIN') {
        targetRoute = '/admin-dashboard';
      } else if (userRole === 'ETUDIANT') {
        targetRoute = '/etudiant-espace';
      } else {
        targetRoute = '/login';
      }
      
      // Vérifier si nous ne sommes pas déjà sur cette route
      if (state.url !== targetRoute) {
        this.router.navigate([targetRoute]);
      } else {
        // Si on tente de rediriger vers la même route, rediriger vers une page d'erreur
        this.router.navigate(['/access-denied']);
      }
      return false;
    }
  }
}