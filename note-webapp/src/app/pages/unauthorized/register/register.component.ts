import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      fullname: ['', Validators.required],
    });
  }

  // Xử lý register
  async onSubmit() {
    if (this.registerForm.valid) {
      const { email, password, fullname } = this.registerForm.value;
      // Gọi AuthService để xử lý đăng nhập
      this.authService.register(email, password, fullname).subscribe({
        next: (res: any) => {
          if (res.message === "User registered successfully") {
            alert('Tạo tài khoản thành công');
            this.router.navigate(['/login']);
          }
        },
        error: (err: any) => {
          console.error('Register failed:', err.error.message);
        },
      });
      // this.router.navigate(['/home']); // Điều hướng sau khi đăng nhập
    }
  }
}
