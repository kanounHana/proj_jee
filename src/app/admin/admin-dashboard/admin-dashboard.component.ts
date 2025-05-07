import { Component, OnInit } from '@angular/core';
import { OffreStageService } from '../../services/offre-stage.service';
import { AuthService } from '../../services/auth.service'; // ← à adapter selon le chemin réel
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalOffres = 0;
  isLoading = true;

  constructor(
    private offreStageService: OffreStageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.offreStageService.getAllOffres().subscribe({
      next: (offres) => {
        this.totalOffres = offres.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
