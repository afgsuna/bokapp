import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { BookService } from '../../services/book';
import { filter } from 'rxjs';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './books.html',
  styleUrl: './books.scss'
})
export class BooksComponent implements OnInit {
  private bookService = inject(BookService);
  private router = inject(Router);

  books: any[] = [];

  ngOnInit() {
    this.loadBooks();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadBooks();
    });
  }

  loadBooks() {
    this.bookService.getAll().subscribe({
      next: (data) => {
        this.books = [...data];
      },
      error: () => this.router.navigate(['/login'])
    });
  }

  delete(id: number) {
    if (confirm('Är du säker på att du vill radera boken?')) {
      this.bookService.delete(id).subscribe(() => this.loadBooks());
    }
  }
}