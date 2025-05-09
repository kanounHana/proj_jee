import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OffreStageService, OffreStage } from '../../services/offre-stage.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { first, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ajouter-offre',
  standalone: false,
  templateUrl: './ajouter-offre.component.html',
  styleUrls: ['./ajouter-offre.component.css']
})
export class AjouterOffreComponent implements OnInit, OnDestroy {
  offreForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  
  // Utiliser un sujet pour la destruction du composant
  private destroy$ = new Subject<void>();
  
  // Référence pour le formulaire HTML
  @ViewChild('offreFormElement') offreFormElement?: ElementRef;

  constructor(
    private fb: FormBuilder,
    private offreStageService: OffreStageService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('Composant - Initialisation');
    this.initForm();
    // Vérification de l'authentification au chargement
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Vérification du rôle
    const userRole = this.authService.getUserRole();
    if (userRole !== 'ADMIN') {
      console.warn('Accès non autorisé: Ce composant nécessite le rôle ADMIN');
      this.router.navigate(['/login']);
      return;
    }
  }

  ngOnDestroy(): void {
    // Nettoyage des observables
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.offreForm = this.fb.group({
      titre: ['', [Validators.required]],
      description: ['', [Validators.required]],
      entreprise: ['', [Validators.required]],
      periode: ['', [Validators.required]],
      lieu: ['', [Validators.required]],
      remuneration: [''],
      competencesRequises: ['', [Validators.required]],
      lienExterne: ['']
    });
  }

  onSubmit(): void {
    console.log('Composant - Méthode onSubmit appelée');
    
    // Éviter les soumissions si déjà en cours
    if (this.isSubmitting) {
      console.warn('Composant - Soumission déjà en cours, ignorée');
      return;
    }
    
    if (this.offreForm.invalid) {
      console.log('Composant - Formulaire invalide');
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.offreForm.controls).forEach(key => {
        const control = this.offreForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // Désactiver la soumission
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Vérifier si l'utilisateur est toujours connecté
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
      this.router.navigate(['/login']);
      this.isSubmitting = false;
      return;
    }

    const offre: OffreStage = {
      ...this.offreForm.value,
      datePublication: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
    };

    console.log('Composant - Envoi des données:', offre);

    this.offreStageService.publierOffre(offre)
      .pipe(
        // Ne prendre que la première réponse pour éviter les traitements multiples
        first(),
        // S'assurer que isSubmitting est réinitialisé dans tous les cas
        finalize(() => {
          console.log('Composant - Finalisation de la requête');
          this.isSubmitting = false;
        }),
        // Désabonnement automatique si le composant est détruit
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          console.log('Composant - Réponse de publication réussie:', response);
          this.successMessage = 'Offre de stage ajoutée avec succès!';
          this.offreForm.reset();
          setTimeout(() => {
            this.router.navigate(['/admin/liste-offres']);
          }, 2000);
        },
        error: (error) => {
          console.error('Composant - Erreur lors de la publication:', error);
          this.errorMessage = `Erreur: ${error.message || 'Une erreur est survenue lors de l\'ajout de l\'offre.'}`;
        }
      });
  }

  resetForm(): void {
    this.offreForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }
}