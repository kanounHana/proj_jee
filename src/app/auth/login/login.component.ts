import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
export class LoginComponent implements OnInit {
  
  // Initialiser directement le formulaire pour éviter les erreurs liées à undefined
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  
  loading = false;
  errorMessage: string | null = null;
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Récupérer l'URL de retour des paramètres de requête ou utiliser '/' par défaut
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Vérifier si l'utilisateur est déjà connecté
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
      return;
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
  
    this.loading = true;
    this.errorMessage = null;
    const { username, password } = this.loginForm.value;
  
    this.authService.login(username, password).subscribe({
      next: () => {
        this.redirectBasedOnRole();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Identifiants incorrects';
      }
    });
  }
  
  private redirectBasedOnRole(): void {
    const role = this.authService.getUserRole();
  
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (role === 'ETUDIANT') {
      this.router.navigate(['/etudiant-espace']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}  