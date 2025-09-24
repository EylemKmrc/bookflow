// src/app/pages/book-new/book-new.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService, Buch } from '../../services/book.service';

type Status = 'ZU_LESEN' | 'LESE' | 'GELESEN' | 'ABGEBROCHEN';

@Component({
  selector: 'app-book-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-new.component.html',
})
export class BookNewComponent {
  private fb = inject(FormBuilder);
  private api = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  error = '';
  id: string | null = null;

  // Bearbeiten-Modus?
  get isEdit(): boolean {
    return !!this.id;
  }

  // Abbrechen → zurück zur Liste
  cancel() {
    this.router.navigate(['/books']);
  }

  // Formular
  form = this.fb.nonNullable.group({
    titel: this.fb.nonNullable.control('', { validators: Validators.required }),
    autorenStr: this.fb.control(''),
    status: this.fb.nonNullable.control<Status>('ZU_LESEN', { validators: Validators.required }),
    bewertung: this.fb.control<number | null>(null),
    notizen: this.fb.control(''),
  });

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) this.load(this.id);
  }

  load(id: string) {
    this.loading = true;
    this.api.get(id).subscribe({
      next: (b: Buch) => {
        this.form.patchValue({
          titel: b.titel,
          autorenStr: (b.autoren || []).join(', '),
          status: b.status,
          bewertung: b.bewertung ?? null,
          notizen: b.notizen ?? '',
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Buch konnte nicht geladen werden';
        this.loading = false;
      },
    });
  }

  save() {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    const payload = {
      titel: v.titel,
      autoren: (v.autorenStr || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      status: v.status,
      bewertung: v.bewertung ?? null,
      notizen: v.notizen || '',
    };

    const req = this.id ? this.api.update(this.id, payload) : this.api.create(payload);
    req.subscribe({
      next: () => this.router.navigate(['/books']),
      error: () => (this.error = 'Speichern fehlgeschlagen'),
    });
  }
}