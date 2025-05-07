import { Component, OnInit } from '@angular/core';
import { OffreStageService, OffreStage } from '../../services/offre-stage.service';

@Component({
  selector: 'app-offres-stage',
  standalone: false,
  templateUrl: './offres-stage.component.html',
  styleUrls: ['./offres-stage.component.css']
})
export class OffresStageComponent implements OnInit {
  offres: OffreStage[] = [];
  filteredOffres: OffreStage[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  
  constructor(private offreStageService: OffreStageService) { }

  ngOnInit(): void {
    this.loadOffres();
  }

  loadOffres(): void {
    this.isLoading = true;
    this.offreStageService.getAllOffres().subscribe({
      next: (data) => {
        this.offres = data;
        this.filteredOffres = [...this.offres];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des offres de stage.';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  filterOffres(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOffres = [...this.offres];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredOffres = this.offres.filter(offre => 
      offre.titre.toLowerCase().includes(term) ||
      offre.entreprise.toLowerCase().includes(term) ||
      offre.lieu.toLowerCase().includes(term) ||
      offre.description.toLowerCase().includes(term) ||
      offre.competencesRequises.toLowerCase().includes(term)
    );
  }
}