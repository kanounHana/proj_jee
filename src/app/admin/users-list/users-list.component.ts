// src/app/admin/users-list/users-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { UserService, User } from '../../services/user.service';
import { UserDeleteComponent } from '../user-delete/user-delete.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  standalone: true,
  imports: [CommonModule, UserDeleteComponent, HttpClientModule]
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.successMessage = null;
    this.error = null;
    
    this.userService.getUsers()
      .pipe(
        catchError(error => {
          this.error = 'Erreur lors du chargement des utilisateurs';
          console.error(error);
          return of([]);
        })
      )
      .subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  viewUser(id: number): void {
    this.router.navigate(['/admin/users', id]);
  }

  editUser(id: number): void {
    this.router.navigate(['/admin/users/edit', id]);
  }

  addNewUser(): void {
    this.router.navigate(['/admin/users/new']);
  }

  handleUserDeleted(userId: number): void {
    // Filtrer l'utilisateur supprimé de la liste locale
    this.users = this.users.filter(user => user.id !== userId);
    this.successMessage = 'Utilisateur supprimé avec succès';
    this.error = null;
    
    // Facultatif: Pour être sûr, on peut rafraîchir la liste depuis le serveur
    // this.loadUsers();
  }

  handleDeletionError(errorMessage: string): void {
    this.error = errorMessage;
    this.successMessage = null;
    
    // On rafraîchit quand même la liste car l'utilisateur pourrait avoir été supprimé
    // malgré l'erreur côté client
    this.loadUsers();
  }

  refreshUsersList(): void {
    console.log('Rafraîchissement de la liste des utilisateurs');
    this.loadUsers();
  }
}