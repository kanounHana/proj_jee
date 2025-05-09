import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RapportStageService } from '../services/rapport-stage.service';

@Component({
  selector: 'app-rapport-delete',
  templateUrl: './rapport-delete.component.html',
  styleUrls: ['./rapport-delete.component.css']
})
export class RapportDeleteComponent {
  @Input() rapportId: number= 0;
  @Output() rapportSupprime = new EventEmitter<number>();
  
  constructor(private rapportService: RapportStageService) { }

  supprimerRapport() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rapport?')) {
      this.rapportService.supprimerRapport(this.rapportId)
        .subscribe({
          next: () => {
            console.log('Rapport supprimé avec succès');
            this.rapportSupprime.emit(this.rapportId);
          },
          error: (err) => {
            console.error('Erreur lors de la suppression du rapport:', err);
            alert('Erreur lors de la suppression du rapport.');
          }
        });
    }
  }
}