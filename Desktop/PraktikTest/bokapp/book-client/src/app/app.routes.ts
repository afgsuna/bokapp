import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { BooksComponent } from './components/books/books';
import { BookFormComponent } from './components/book-form/book-form';
import { QuotesComponent } from './components/quotes/quotes';
import { AdminComponent } from './components/admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'books', component: BooksComponent },
  { path: 'books/new', component: BookFormComponent },
  { path: 'books/edit/:id', component: BookFormComponent },
  { path: 'quotes', component: QuotesComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '/login' }
];