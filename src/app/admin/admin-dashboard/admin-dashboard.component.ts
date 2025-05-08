import { Component, OnInit } from '@angular/core';
import { OffreStageService } from '../../services/offre-stage.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service'; // Ajoutez cette importation
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalOffres = 0;
  totalUsers = 0; // Ajouté pour compter les utilisateurs
  isLoading = true;

  constructor(
    private offreStageService: OffreStageService,
    private authService: AuthService,
    private userService: UserService, // Ajoutez cette injection
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    
    // Charger les statistiques des offres
    this.offreStageService.getAllOffres().subscribe({
      next: (offres) => {
        this.totalOffres = offres.length;
        this.loadUserStats(); // Appeler la méthode pour charger les stats utilisateurs
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques des offres:', error);
        this.loadUserStats(); // Continuer avec les stats utilisateurs même si les offres échouent
      }
    });
  }

  // Nouvelle méthode pour charger les statistiques utilisateurs
  loadUserStats(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques utilisateurs:', error);
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}