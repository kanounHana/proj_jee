import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class LoginComponent {

  
  // Initialiser directement le formulaire pour éviter les erreurs liées à undefined
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }



  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.errorMessage = null;
    const { username, password } = this.loginForm.value;
    
    this.authService.login(username, password)
      .subscribe({
        next: (response) => {
          this.loading = false;
          
          // Utiliser directement le rôle de la réponse pour la redirection
          console.log("Connexion réussie avec le rôle:", response.role);
          
          // Redirection basée sur le rôle
          if (response.role === 'ADMIN') {
            console.log("Redirection vers admin dashboard");
            this.router.navigate(['/admin-dashboard']);
          } else if (response.role === 'ETUDIANT') {
            console.log("Redirection vers étudiant dashboard");
            this.router.navigate(['/etudiant-espace']);
          } 
          
        },
        error: (error) => {
          console.error("Erreur de connexion:", error);
          this.errorMessage = "nom d'utilisateur ou mot de passe incorrect";
          this.loading = false;
        }
      });
  }
}