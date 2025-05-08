// src/app/rapports/rapports-etudiants/rapports-etudiants.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { RapportService } from '../../services/rapport.service';

@Component({
  selector: 'app-rapports-etudiants',
  templateUrl: './rapports-etudiants.component.html',
  styleUrls: ['./rapports-etudiants.component.css'],
  imports: [CommonModule, RouterModule],
  standalone: true
})
export class RapportsEtudiantsComponent implements OnInit {
  rapports: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private rapportService: RapportService) { }

  ngOnInit(): void {
    this.chargerRapports();
  }

  chargerRapports(): void {
    this.isLoading = true;
    this.rapportService.getAllRapports().subscribe(
      (data) => {
        this.rapports = data;
        this.isLoading = false;
      },
      (err) => {
        this.error = `Erreur lors du chargement des rapports: ${err}`;
        this.isLoading = false;
        console.error(err);
      }
    );
  }

  visualiserRapport(id: number): void {
    window.open(`/api/rapports/telecharger/${id}`, '_blank');
  }

  telechargerRapport(id: number): void {
    this.isLoading = true;
    this.rapportService.telechargerRapport(id).subscribe(
      (response: Blob) => {
        // Créer une URL pour le blob
        const url = window.URL.createObjectURL(response);
        // Créer un élément 'a' temporaire pour déclencher le téléchargement
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-${id}.pdf`; // Vous pouvez ajuster le nom du fichier si nécessaire
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      },
      (error) => {
        this.error = `Erreur lors du téléchargement: ${error}`;
        this.isLoading = false;
        console.error('Erreur lors du téléchargement', error);
      }
    );
  }
}