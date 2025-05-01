import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // Ajustez selon votre configuration
  private currentUserSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          // Stocker le token et le username
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          
          // Mettre à jour les subjects
          this.tokenSubject.next(response.token);
          this.currentUserSubject.next(response.username);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    // Supprimer les données d'authentification
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // Mettre à jour les subjects
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    
    // Rediriger vers la page de login
    this.router.navigate(['']);
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getCurrentUser(): string | null {
    return this.currentUserSubject.value;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur s\'est produite';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.status === 401) {
        errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
      } else {
        errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
      }
    }
    
    return throwError(() => errorMessage);
  }
}