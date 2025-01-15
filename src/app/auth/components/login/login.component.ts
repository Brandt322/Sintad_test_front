import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '@auth/services/authentication.service';
import { ToastService } from '@core/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  remenber: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    sessionStorage.clear();

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Si el formulario es válido, procede con la autenticación
    const { username, password } = this.loginForm.value;

    this.authenticationService.login({ username, password }).subscribe({
      next: () => {
        localStorage.setItem('username',  username );
        this.toastService.show('success', 'Bienvenido');
        this.router.navigate(['/intranet']);
      },
      error: (err: any) => {
        // alert('Usuario o contraseña incorrectos.');
        console.log('Error: ', err);
      }
    });
  }

}
