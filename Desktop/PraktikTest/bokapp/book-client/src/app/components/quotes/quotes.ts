import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd} from '@angular/router';
import { QuoteService } from '../../services/quote';
import { filter } from 'rxjs';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quotes.html',
  styleUrl: './quotes.scss'
})
export class QuotesComponent implements OnInit {
  private quoteService = inject(QuoteService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  quotes: any[] = [];
  newQuote = { text: '', author: '' };
  editingQuote: any = null;

  ngOnInit() {
    this.loadQuotes();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadQuotes();
    });
  }

  loadQuotes() {
    this.quoteService.getAll().subscribe({
      next: (data) => {
        this.quotes = [...data];
        this.cdr.detectChanges();
    },
      error: () => this.router.navigate(['/login'])
    });
  }

  add() {
    if (!this.newQuote.text) return;
    this.quoteService.create(this.newQuote).subscribe(() => {
      this.newQuote = { text: '', author: '' };
      this.loadQuotes();
    });
  }

  startEdit(quote: any) {
    this.editingQuote = { ...quote };
  }

  saveEdit() {
    this.quoteService.update(this.editingQuote.id, this.editingQuote).subscribe(() => {
      this.editingQuote = null;
      this.loadQuotes();
    });
  }

  delete(id: number) {
    if (confirm('Är du säker på att du vill radera citatet?')) {
      this.quoteService.delete(id).subscribe(() => this.loadQuotes());
    }
  }
}