import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService, Buch } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent {
  books = signal<Buch[]>([]);
  q = '';

  constructor(private api: BookService, private auth: AuthService, private router: Router) {
    this.load();
  }

  load() {
    this.api.list(this.q).subscribe(res => this.books.set(res.items || []));
  }

  edit(b: Buch) {
    this.router.navigate(['/books', b._id, 'edit']);
  }
  
  goToNew() { this.router.navigate(['/books/new']); }
  markRead(b: Buch) { this.api.update(b._id, { status: 'GELESEN' }).subscribe(() => this.load()); }
  del(b: Buch) {
    if (!confirm(`Buch "${b.titel}" löschen?`)) return;
    this.api.remove(b._id).subscribe(() => this.load());
  }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}