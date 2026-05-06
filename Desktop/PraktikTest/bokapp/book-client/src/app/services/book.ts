import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private api = 'http://localhost:5120/api/Books';

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getAll() {
    return this.http.get<any[]>(this.api, { headers: this.headers() });
  }

  create(book: any) {
    return this.http.post(this.api, book, { headers: this.headers() });
  }

  update(id: number, book: any) {
    return this.http.put(`${this.api}/${id}`, book, { headers: this.headers() });
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`, { headers: this.headers() });
  }
}
