import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OffreStageService, OffreStage } from '../../services/offre-stage.service';

@Component({
  selector: 'app-offres-stage',
  standalone:false,
  templateUrl: './offres-stage.component.html',
  styleUrls: ['./offres-stage.component.css']
})
export class OffresStageComponent implements OnInit {
  offres: OffreStage[] = [];
  loading: boolean = true;
  error: string | null = null;
  showScrollTop: boolean = false;

  constructor(
    private offreStageService: OffreStageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerOffres();
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Afficher le bouton lorsque l'utilisateur descend de 300px
    this.showScrollTop = window.pageYOffset > 300;
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  chargerOffres(): void {
    this.loading = true;
    this.error = null;
    
    this.offreStageService.getOffres().subscribe({
      next: (data) => {
        this.offres = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des offres:', err);
        this.error = 'Impossible de charger les offres de stage. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  // Modifier la méthode pour qu'elle accepte un id potentiellement undefined
  voirDetails(id: number): void {
    if (id !== undefined && id !== null && id !== 0) {
      this.router.navigate(['/etudiant/offres', id]);
    } else {
      console.error('ID d\'offre invalide');
      // Optionnel: Afficher un message d'erreur à l'utilisateur
      this.error = 'Impossible d\'afficher les détails de cette offre.';
    }
  }

  retourEspace(): void {
    this.router.navigate(['/etudiant']);
  }
}