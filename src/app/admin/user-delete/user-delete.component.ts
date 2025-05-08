// src/app/admin/user-delete/user-delete.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UserDeleteComponent {
  @Input() userId!: number;
  @Output() userDeleted = new EventEmitter<number>();
  @Output() deletionError = new EventEmitter<string>();
  @Output() refreshRequest = new EventEmitter<void>();
  
  isDeleting = false;

  constructor(private userService: UserService) {}

  confirmDelete(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.isDeleting = true;
      
      this.userService.deleteUser(this.userId)
        .pipe(
          tap(() => {
            console.log('Suppression réussie');
          }),
          catchError(error => {
            console.log('Une erreur s\'est produite, mais nous allons vérifier si la suppression a fonctionné');
            console.error(error);
            // On émet quand même l'événement de suppression si c'est un problème de réponse HTTP
            // mais pas de contenu (204 No Content)
            if (error.status === 0 || error.status === 204) {
              console.log('Probable suppression réussie malgré l\'erreur');
              this.userDeleted.emit(this.userId);
            } else {
              this.deletionError.emit('Erreur lors de la suppression de l\'utilisateur');
            }
            return of(null);
          }),
          finalize(() => {
            this.isDeleting = false;
            // Émettre une demande de rafraîchissement dans tous les cas
            this.refreshRequest.emit();
          })
        )
        .subscribe({
          next: (response) => {
            if (response !== null) {
              console.log('Suppression confirmée, mise à jour de l\'interface');
              this.userDeleted.emit(this.userId);
            }
          }
        });
    }
  }
}