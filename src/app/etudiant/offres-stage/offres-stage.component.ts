import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OffreStageService, OffreStage } from '../../services/offre-stage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-offres-stage',
  standalone:false,
  templateUrl: './offres-stage.component.html',
  styleUrls: ['./offres-stage.component.scss']
})
export class OffresStageComponent implements OnInit {
  offres: OffreStage[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private offreStageService: OffreStageService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.chargerOffres();
  }

  chargerOffres(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.offreStageService.getAllOffres().subscribe({
      next: (data) => {
        this.offres = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des offres de stage. Veuillez réessayer.';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  voirDetails(id: number): void {
    // Navigation vers la page de détails d'une offre
    this.router.navigate(['/etudiant/offres', id]);
  }

  retourEspaceEtudiant(): void {
    this.router.navigate(['/etudiant']);
  }

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}