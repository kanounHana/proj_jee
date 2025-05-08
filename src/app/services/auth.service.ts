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
  role: string; 
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private currentUserSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  private userRoleSubject = new BehaviorSubject<string | null>(localStorage.getItem('userRole')); // Nouveau subject pour le rôle
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public userRole$ = this.userRoleSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          // Stocker le token, username et le rôle
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          localStorage.setItem('userRole', response.role); // Stocker le rôle
          
          // Mettre à jour les subjects
          this.tokenSubject.next(response.token);
          this.currentUserSubject.next(response.username);
          this.userRoleSubject.next(response.role); // Mettre à jour le subject du rôle
        }),
        catchError((error) => {
          this.handleError(error);
          return throwError(() => error); // or return EMPTY, or a default value wrapped in of()
        })
      );
  }

  logout(): void {
    // Supprimer les données d'authentification
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole'); // Supprimer le rôle également
    
    // Mettre à jour les subjects
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.userRoleSubject.next(null); // Réinitialiser le subject du rôle
    
    // Rediriger vers la page de login
    this.router.navigate(['']);
  }

  // Nouvelle méthode pour obtenir le rôle
  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }

  // Les autres méthodes restent les mêmes
  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getCurrentUser(): string | null {
    return this.currentUserSubject.value;
  }

  // Nouvelle méthode pour vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: string): boolean {
    return this.userRoleSubject.value === role;
  }

  private handleError(error: HttpErrorResponse) {
    // Reste inchangé
  }
  // Déconnexion de l'utilisateur
  
}