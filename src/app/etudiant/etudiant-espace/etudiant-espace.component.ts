import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-etudiant-espace',
  standalone:false,
  templateUrl: './etudiant-espace.component.html',
  styleUrls: ['./etudiant-espace.component.css']
})
export class EtudiantEspaceComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  consulterOffres(): void {
    this.router.navigate(['/etudiant/offres']);
  }

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}