// offre-stage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
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
    console.log('Service - Début de publierOffre');
    
    // Suppression de retry(1) pour éviter les doubles soumissions
    return this.http.post<any>(`${this.apiUrl}/publier-offre`, offre)
      .pipe(
        tap(response => {
          console.log('Service - Réponse API reçue:', response);
        }),
        catchError((error: HttpErrorResponse) => {
          // Ajout de logs pour débugger
          console.error('Service - Erreur HTTP:', error);
          
          // Si le statut est 200 mais considéré comme erreur, c'est peut-être un problème de format
          if (error.status === 200) {
            console.log('Service - Status 200 mais erreur, tentative de récupération de la réponse');
            
            // Tenter de convertir cette "erreur" en succès
            if (error.error && typeof error.error !== 'object') {
              try {
                const parsedData = JSON.parse(error.error);
                console.log('Service - Réponse parsée avec succès:', parsedData);
                return of(parsedData);
              } catch (e) {
                console.error('Service - Échec du parsing:', e);
              }
            } else if (error.error && typeof error.error === 'object') {
              console.log('Service - Réponse est déjà un objet, retournant directement');
              return of(error.error);
            }
          }
          
          // Si non autorisé, rediriger
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          
          // Simplifier le message d'erreur
          let errorMsg;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Erreur client: ${error.error.message}`;
          } else {
            errorMsg = `Erreur serveur: ${error.status} - ${error.statusText}`;
            if (error.error?.message) {
              errorMsg += ` - ${error.error.message}`;
            }
          }
          
          console.error('Service - Message d\'erreur final:', errorMsg);
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
  checkIfPdfExists() {
    const url = 'docs/demande de stage.pdf';

    this.http.head(url, { observe: 'response' }).subscribe({
      next: (response) => {
        if (response.status === 200) {
          console.log('✅ PDF trouvé');
          this.downloadPdf();
        }
      },
      error: (err) => {
        console.log('❌ PDF introuvable', err);
      }
    });
  }

  downloadPdf() {
    const link = document.createElement('a');
    link.href = 'docs/demande de stage.pdf';
    link.download = 'demande de stage .pdf';
    link.click();
  }
}