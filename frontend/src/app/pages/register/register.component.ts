import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('password')?.value;
  const pw2 = group.get('confirmPassword')?.value;
  return pw && pw2 && pw === pw2 ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form!: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordsMatch });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    const { username, password } = this.form.value;
    this.auth.register({ username, password }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (e) => { this.error = e?.error?.error || 'Registrierung fehlgeschlagen'; this.loading = false; }
    });
  }
}