// src/app/services/rapport.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RapportService {
  private apiUrl = 'http://localhost:8080/api/rapports'; // URL relative qui sera gérée par le proxy

  constructor(private http: HttpClient) { }

  // Récupérer tous les rapports (pour admin)
  getAllRapports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  // Télécharger un rapport
  telechargerRapport(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/telecharger/${id}`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
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