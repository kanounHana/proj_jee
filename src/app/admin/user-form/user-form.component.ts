import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserCreateComponent implements OnInit {
  userForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  roles = [
    { value: 'ADMIN', label: 'Administrateur' },
    { value: 'STUDENT', label: 'Étudiant' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['STUDENT', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validation personnalisée pour vérifier que les mots de passe correspondent
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    // Préparer les données de l'utilisateur (sans confirmPassword)
    const userData = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      role: this.userForm.value.role
    };

    this.userService.createUser(userData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: () => {
          // Redirection vers la liste des utilisateurs
          this.router.navigate(['/admin/users'], { 
            queryParams: { created: 'success' } 
          });
        },
        error: (error) => {
          console.error('Erreur lors de la création de l\'utilisateur', error);
          this.errorMessage = 'Erreur lors de la création de l\'utilisateur. Veuillez réessayer.';
          
          // Si le serveur renvoie un message d'erreur spécifique
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          }
        }
      });
  }

  // Getters pour faciliter l'accès aux contrôles du formulaire dans le template
  get f() { return this.userForm.controls; }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }
}