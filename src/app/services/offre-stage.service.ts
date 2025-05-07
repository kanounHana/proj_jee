// offre-stage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export interface OffreStage {
  id?: number;
  titre: string;
  description: string;
  entreprise: string;
  periode: string;
  lieu: string;
  remuneration?: string;
  competencesRequises: string;
  lienExterne?: string;
  datePublication?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OffreStageService {
  private apiUrl = 'http://localhost:8080/api/offres';
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  // Correction: Ajout du chemin "/publier-offre" pour respecter le backend
  publierOffre(offre: OffreStage): Observable<any> {
    console.log('Envoi des données de l\'offre:', offre);
    return this.http.post<any>(`${this.apiUrl}/publier-offre`, offre)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          console.error('Erreur lors de la publication de l\'offre:', error);
          
          // Si non autorisé, rediriger vers la page de connexion
          if (error.status === 401) {
            console.log('Erreur d\'authentification. Redirection vers la page de connexion...');
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          
          // Créer un message d'erreur convivial
          let errorMsg = 'Une erreur est survenue lors de la publication de l\'offre.';
          if (error.error instanceof ErrorEvent) {
            // Erreur côté client
            errorMsg = `Erreur: ${error.error.message}`;
          } else {
            // Erreur côté serveur
            errorMsg = `Code d'erreur: ${error.status}, Message: ${error.error?.message || error.statusText}`;
          }
          
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  // Garder les autres méthodes inchangées
  getAllOffres(): Observable<OffreStage[]> {
    return this.http.get<OffreStage[]>(`${this.apiUrl}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          return throwError(() => new Error('Erreur lors de la récupération des offres'));
        })
      );
  }

  getOffres(): Observable<OffreStage[]> {
    return this.getAllOffres();
  }

  deleteOffre(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          return throwError(() => new Error('Erreur lors de la suppression de l\'offre'));
        })
      );
  }

  getOffreById(id: number): Observable<OffreStage> {
    return this.http.get<OffreStage>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          return throwError(() => new Error('Erreur lors de la récupération de l\'offre'));
        })
      );
  }

  updateOffre(id: number, offre: OffreStage): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, offre)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          return throwError(() => new Error('Erreur lors de la mise à jour de l\'offre'));
        })
      );
  }
}