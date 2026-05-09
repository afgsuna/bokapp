import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  users: any[] = [];
  token = '';
  username = '';
  password = '';
  error = '';
  isLoggedIn = false;
  resetPasswords: { [key: number]: string } = {};

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.token}` });
  }

  ngOnInit() {}

  login() {
    this.http.post<{ token: string }>('https://bokapp-production.up.railway.app/api/Admin/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.token = res.token;
        this.isLoggedIn = true;
        this.loadUsers();
      },
      error: () => {
        this.error = 'Fel uppgifter eller inte admin.';
      }
    });
  }

  loadUsers() {
    this.http.get<any[]>('https://bokapp-production.up.railway.app/api/Admin/users', {
      headers: this.headers()
    }).subscribe(data => this.users = data);
  }

  deleteUser(id: number) {
    if (confirm('Är du säker på att du vill radera användaren?')) {
      this.http.delete(`http://localhost:5120/api/Admin/users/${id}`, {
        headers: this.headers()
      }).subscribe(() => this.loadUsers());
    }
  }

  resetPassword(id: number) {
    const newPassword = this.resetPasswords[id];
    if (!newPassword) return;
    this.http.post(`http://localhost:5120/api/Admin/users/${id}/reset-password`, {
      newPassword
    }, { headers: this.headers() }).subscribe(() => {
      alert('Lösenord återställt!');
      this.resetPasswords[id] = '';
    });
  }

  logout() {
    this.isLoggedIn = false;
    this.token = '';
    this.username = '';
    this.password = '';
    this.users = [];
  }
}