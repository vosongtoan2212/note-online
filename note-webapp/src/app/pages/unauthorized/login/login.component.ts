import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatGridListModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Xử lý login
  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      // Gọi AuthService để xử lý đăng nhập
      this.authService.loginWithEmail(email, password).subscribe({
        next: (res: any) => {
          const token = res.accessToken;
          if (token) {
            this.authService.saveToken(token);
            this.router.navigate(['/home']);
          }
        },
        error: (err: any) => {
          console.error('Login failed:', err.error.message);
        },
      });
      // this.router.navigate(['/home']); // Điều hướng sau khi đăng nhập
    }
  }

  // Xử lý đăng nhập bằng Google
  loginWithGoogle() {
    this.authService.loginWithGoogle();
    this.router.navigate(['/home']); // Điều hướng sau khi đăng nhập
  }
}
