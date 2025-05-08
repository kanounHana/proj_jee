import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gestion des Stages';
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}