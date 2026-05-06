import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  error = '';
  success = '';

  register() {
  this.auth.register(this.username, this.password).subscribe({
    next: () => {
      this.router.navigate(['/login'], { queryParams: { registered: true } });
    },
    error: () => {
      this.error = 'Användarnamnet är redan taget.';
    }
  });
 }
 
}