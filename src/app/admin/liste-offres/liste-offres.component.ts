import { Component, OnInit } from '@angular/core';
import { OffreStageService, OffreStage } from '../../services/offre-stage.service';

@Component({
  selector: 'app-liste-offres',
  standalone: false,
  templateUrl: './liste-offres.component.html',
  styleUrls: ['./liste-offres.component.css']
})
export class ListeOffresComponent implements OnInit {
  offres: OffreStage[] = [];
  isLoading = true;
  errorMessage = '';
  
  constructor(private offreStageService: OffreStageService) { }

  ngOnInit(): void {
    this.loadOffres();
  }

  loadOffres(): void {
    this.isLoading = true;
    this.offreStageService.getAllOffres().subscribe({
      next: (data) => {
        this.offres = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des offres de stage.';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  deleteOffre(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre de stage?')) {
      this.offreStageService.deleteOffre(id).subscribe({
        next: () => {
          this.offres = this.offres.filter(offre => offre.id !== id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de l\'offre de stage.');
        }
      });
    }
  }
}