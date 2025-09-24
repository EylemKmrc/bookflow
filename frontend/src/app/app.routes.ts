import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { BooksComponent } from './pages/books/books.component';
import { BookNewComponent } from './pages/book-new/book-new.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'books', component: BooksComponent, canActivate: [authGuard] },
  { path: 'books/:id/edit', component: BookNewComponent, canActivate: [authGuard] },
 { path: 'books/new', component: BookNewComponent, canActivate: [authGuard] }
];

