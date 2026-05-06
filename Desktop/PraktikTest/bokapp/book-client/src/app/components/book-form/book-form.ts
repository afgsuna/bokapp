import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.scss'
})
export class BookFormComponent implements OnInit {
  private bookService = inject(BookService);
  router = inject(Router);
  private route = inject(ActivatedRoute);

  book = { title: '', author: '', publishedDate: '' };
  isEdit = false;
  bookId: number | null = null;

  ngOnInit() {
    this.bookId = this.route.snapshot.params['id'];
    if (this.bookId) {
      this.isEdit = true;
      this.bookService.getAll().subscribe((books) => {
        const found = books.find(b => b.id == this.bookId);
        if (found) {
          this.book = {
            title: found.title,
            author: found.author,
            publishedDate: found.publishedDate.substring(0, 10)
          };
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/books']);
  }

  save() {
    if (this.isEdit && this.bookId) {
      this.bookService.update(this.bookId, this.book).subscribe(() => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/books']);
        });
      });
    } else {
      this.bookService.create(this.book).subscribe(() => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/books']);
        });
      });
    }
  }
}