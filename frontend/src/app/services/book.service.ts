// src/app/services/book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environment/environment';

export type Buch = {
  _id: string;
  titel: string;
  autoren: string[];
  status: 'ZU_LESEN' | 'LESE' | 'GELESEN' | 'ABGEBROCHEN';
  bewertung?: number | null;
  notizen?: string;
  createdAt?: string;
  updatedAt?: string;
};

@Injectable({ providedIn: 'root' })
export class BookService {
  constructor(private http: HttpClient) {}

  list(q?: string, page?: number, limit?: number) {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    if (page) params = params.set('page', page);
    if (limit) params = params.set('limit', limit);

    return this.http.get<{ items: Buch[]; total?: number; page?: number; pages?: number }>(
      `${environment.apiBase}/books`,
      { params }
    );
  }

  // <— neu: einzelnes Buch laden (für Edit)
  get(id: string) {
    return this.http.get<Buch>(`${environment.apiBase}/books/${id}`);
  }

  create(data: Partial<Buch>) {
    return this.http.post<Buch>(`${environment.apiBase}/books`, data);
  }

  update(id: string, data: Partial<Buch>) {
    return this.http.put<Buch>(`${environment.apiBase}/books/${id}`, data);
  }

  remove(id: string) {
    return this.http.delete<{ ok: boolean }>(`${environment.apiBase}/books/${id}`);
  }
}