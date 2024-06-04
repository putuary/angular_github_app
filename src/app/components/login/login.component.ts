import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  response: any = [];
  error: HttpErrorResponse | undefined;
  completed: boolean = false;

  formGroup = new FormGroup({
    token: new FormControl('', [Validators.required]),
  })

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if(!this.formGroup.valid) {
      alert('Please enter a valid input');
      return;
    }

    const token : string = this.formGroup.value.token as string;

    localStorage.setItem('token', token);
    this.authService.login(token).subscribe({
      next: response => this.response = response,
      error: err => {
        this.error = err;
        alert(this.error);
      },
      complete: () => {
        this.completed = true
        console.log(this.response);
        this.router.navigate(['/dashboard']);
      },
    });
  }
}
