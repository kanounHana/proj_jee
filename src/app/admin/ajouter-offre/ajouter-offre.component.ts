import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OffreStageService, OffreStage } from '../../services/offre-stage.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ajouter-offre',
  standalone: false,
  templateUrl: './ajouter-offre.component.html',
  styleUrls: ['./ajouter-offre.component.css']
})
export class AjouterOffreComponent implements OnInit {
  offreForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private offreStageService: OffreStageService,
    private router: Router,
    private authService: AuthService // Ajout du service d'authentification
  ) { }

  ngOnInit(): void {
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
    if (this.offreForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.offreForm.controls).forEach(key => {
        const control = this.offreForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Vérifier si l'utilisateur est toujours connecté
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
      this.router.navigate(['/login']);
      return;
    }

    const offre: OffreStage = {
      ...this.offreForm.value,
      datePublication: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
    };

    console.log('Envoi de l\'offre avec le token:', !!this.authService.getToken());

    this.offreStageService.publierOffre(offre).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Offre de stage ajoutée avec succès!';
        this.offreForm.reset();
        setTimeout(() => {
          this.router.navigate(['/admin/liste-offres']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = `Erreur: ${error.message || 'Une erreur est survenue lors de l\'ajout de l\'offre.'}`;
        console.error('Erreur détaillée:', error);
      }
    });
  }

  resetForm(): void {
    this.offreForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }
}