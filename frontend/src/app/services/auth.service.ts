// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private key = 'token';

  constructor(private http: HttpClient) {}

  register(data: { username: string; password: string }) {
    return this.http.post<{ message: string }>(`${environment.apiBase}/auth/register`, data);
  }

  login(data: { username: string; password: string }) {
    return this.http.post<{ token: string }>(`${environment.apiBase}/auth/login`, data);
  }

  saveToken(token: string) { localStorage.setItem(this.key, token); }
  getToken(): string | null { return localStorage.getItem(this.key); }
  logout() { localStorage.removeItem(this.key); }
  isLoggedIn(): boolean { return !!this.getToken(); }
}