import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RapportStageService {
  private apiUrl = 'http://localhost:8080/api/rapports';
  

  constructor(private http: HttpClient) { }

  // Déposer un rapport de stage
  deposerRapport(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.apiUrl}/deposer`, formData, {
      responseType: 'text'
    });
  }

  // Récupérer les rapports de l'étudiant connecté
  getMesRapports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mes-rapports`)
      .pipe(
        catchError(this.handleError)
      );
  }
  

  // Télécharger un rapport par son ID
  telechargerRapport(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/telecharger/${id}`, {
      responseType: 'blob'
    });
  }
  // Gestion des erreurs
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}