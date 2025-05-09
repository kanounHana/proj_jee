import { Component, OnInit, HostListener } from '@angular/core';
import { RapportStageService } from '../../services/rapport-stage.service';

@Component({
  selector: 'app-rapport-stage',
  standalone:false,
  templateUrl: './rapport-stage.component.html',
  styleUrls: ['./rapport-stage.component.css']
})
export class RapportStageComponent implements OnInit {
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: string | null = null;
  isLoading: boolean = false;
  mesRapports: any[] = [];
  showScrollTop: boolean = false;

  constructor(private rapportStageService: RapportStageService) { }

  ngOnInit(): void {
    this.chargerMesRapports();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Afficher le bouton lorsque l'utilisateur descend de 300px
    this.showScrollTop = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    // Vérifier si le fichier est un PDF
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.uploadError = null;
    } else {
      this.uploadError = 'Veuillez sélectionner un fichier PDF.';
      this.selectedFile = null;
    }
  }

  deposerRapport(): void {
    if (!this.selectedFile) {
      this.uploadError = 'Veuillez sélectionner un fichier PDF.';
      return;
    }

    this.isLoading = true;
    this.uploadSuccess = false;
    this.uploadError = null;

    this.rapportStageService.deposerRapport(this.selectedFile)
      .subscribe({
        next: (response) => {
          console.log('Rapport déposé avec succès', response);
          this.uploadSuccess = true;
          this.selectedFile = null;
          this.isLoading = false;
          this.chargerMesRapports(); // Recharger la liste après dépôt
        },
        error: (error) => {
          console.error('Erreur lors du dépôt du rapport', error);
          this.uploadError = 'Une erreur est survenue lors du dépôt du rapport. Veuillez réessayer.';
          this.isLoading = false;
        }
      });
  }

  chargerMesRapports(): void {
    this.rapportStageService.getMesRapports()
      .subscribe({
        next: (rapports) => {
          this.mesRapports = rapports;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des rapports', error);
        }
      });
  }

  telechargerRapport(id: number): void {
    this.rapportStageService.telechargerRapport(id)
      .subscribe({
        next: (response: Blob) => {
          // Créer un lien temporaire pour télécharger le fichier
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.style.display = 'none';
          a.href = url;
          a.download = `rapport-${id}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Erreur lors du téléchargement du rapport', error);
        }
      });
  }
  onRapportSupprime(rapportId: number): void {
    // Mettre à jour la liste des rapports en supprimant celui qui vient d'être effacé
    this.mesRapports = this.mesRapports.filter(rapport => rapport.id !== rapportId);
  }
}