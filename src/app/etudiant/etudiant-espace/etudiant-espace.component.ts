import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OffreStageService } from '../../services/offre-stage.service';
@Component({
  selector: 'app-etudiant-espace',
  standalone: false,
  templateUrl: './etudiant-espace.component.html',
  styleUrls: ['./etudiant-espace.component.css']
})
export class EtudiantEspaceComponent {
  

  constructor(
    private router: Router,
    private authService: AuthService,
    private offrestageservice:OffreStageService
  ) {}

  // Méthode pour naviguer vers la liste des offres de stage
  consulterOffres() {
    console.log('Navigation vers la liste des offres...');
    this.router.navigate(['/etudiant/offres']);
  }

  // Méthode pour naviguer vers la gestion des rapports de stage
  gererRapports() {
    console.log('Navigation vers la gestion des rapports...');
    this.router.navigate(['/etudiant/rapports']);
  }

  // Méthode pour se déconnecter
  deconnexion() {
    console.log('Déconnexion...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  downloadPdf() {
    this.offrestageservice.checkIfPdfExists();
  }
  
}