import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-etudiant-espace',
  standalone: false,
  templateUrl: './etudiant-espace.component.html',
  styleUrl: './etudiant-espace.component.css'
})
export class EtudiantEspaceComponent {
  constructor(private authService:AuthService,private router:Router){}
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
