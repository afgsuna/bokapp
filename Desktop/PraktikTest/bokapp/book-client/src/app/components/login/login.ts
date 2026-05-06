import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  username = '';
  password = '';
  error = '';
  success = '';

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['registered']) {
        this.success = 'Registrering lyckades! Du kan nu logga in.';
      }
      if (params['loggedout']) {
        this.success = 'Du har loggat ut.';
      }
    });
  }

  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.success = 'Inloggning lyckades! Omdirigerar...';
        setTimeout(() => this.router.navigate(['/books']), 1000);
      },
      error: () => {
        this.error = 'Fel användarnamn eller lösenord.';
      }
    });
  }
}