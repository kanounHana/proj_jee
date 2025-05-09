import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreStageService, OffreStage } from '../../services/offre-stage.service';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-offre-details',
  standalone: false,
  templateUrl: './offre-details.component.html',
  styleUrls: ['./offre-details.component.css']
})
export class OffreDetailsComponent implements OnInit {
  offre: OffreStage | null = null;
  loading: boolean = true;
  error: string | null = null;
  safeLienExterne: SafeUrl | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreStageService: OffreStageService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Vérification de l'authentification au chargement
    if (!this.authService.isLoggedIn()) {
      console.log('Non authentifié, redirection vers login');
      this.router.navigate(['/login']);
      return;
    }
    
    console.log('État d\'authentification:', this.authService.isLoggedIn());
    console.log('Token présent:', !!this.authService.getToken());
    console.log('Rôle utilisateur:', this.authService.getUserRole());
    
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      
      console.log('ID de l\'offre demandée:', id);
      
      if (id) {
        // Vérifier à nouveau le token juste avant l'appel API
        if (!this.authService.getToken()) {
          console.error('Token absent avant chargement de l\'offre');
          this.error = 'Session expirée. Veuillez vous reconnecter.';
          this.loading = false;
          return;
        }
        
        this.chargerOffre(id);
      } else {
        this.error = 'Identifiant d\'offre non valide';
        this.loading = false;
      }
    });
  }

  chargerOffre(id: number): void {
    this.loading = true;
    this.error = null;
    
    console.log(`Chargement de l'offre ${id} avec token:`, !!this.authService.getToken());
    
    this.offreStageService.getOffreById(id).subscribe({
      next: (data) => {
        console.log('Offre chargée avec succès:', data);
        this.offre = data;
        
        // Sécuriser l'URL externe si elle existe
        if (this.offre && this.offre.lienExterne) {
          this.safeLienExterne = this.sanitizer.bypassSecurityTrustUrl(this.offre.lienExterne);
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur détaillée lors du chargement:', err);
        
        if (err.status === 401) {
          console.log('Erreur 401: Token invalide ou expiré');
          this.authService.logout(); // Déconnexion en cas d'erreur d'authentification
          this.router.navigate(['/login']);
          return;
        }
        
        this.error = 'Impossible de charger les détails de l\'offre. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  retourListeOffres(): void {
    this.router.navigate(['/etudiant/offres']);
  }
}