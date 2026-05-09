import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private api = 'https://bokapp-production.up.railway.app/api/Quotes';

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getAll() {
    return this.http.get<any[]>(this.api, { headers: this.headers() });
  }

  create(quote: any) {
    return this.http.post(this.api, quote, { headers: this.headers() });
  }

  update(id: number, quote: any) {
    return this.http.put(`${this.api}/${id}`, quote, { headers: this.headers() });
  }

    delete(id: number) {
    return this.http.delete(`${this.api}/${id}`, { headers: this.headers() });
  }
}
