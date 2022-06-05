import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = new UntypedFormControl('');
  password = new UntypedFormControl('');

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  async login() {
    try {
      const result = await this.authService.login(
        this.username.value,
        this.password.value,
      );
      if (result && result.access_token) {
        localStorage.setItem('user', JSON.stringify(result));
        this.router.navigate(['/', 'home']);
      }
    } catch (error) {
      if (error?.error?.statusCode === 401) {
        this.snackBar.open('Comprueba las credenciales', null, {
          duration: 2000,
        });
      } else {
        this.snackBar.open('Ha ocurrido un error', null, {
          duration: 2000,
        });
      }
    }
  }

  async getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}
