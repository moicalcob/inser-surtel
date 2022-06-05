import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent {
  create_mode = false;
  user_form = new UntypedFormGroup({
    username: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('', Validators.required),
    name: new UntypedFormControl('', Validators.required),
    admin_role: new UntypedFormControl(false),
  });
  user_id: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router,
  ) {
    this.create_mode = this.route.snapshot.params.user_id === 'create';
    if (!this.create_mode) {
      this.load_user(this.route.snapshot.params.user_id);
    }
  }

  async load_user(user_id) {
    try {
      const user = await this.authService.getUser(user_id);
      this.user_id = user._id;
      this.user_form.setValue({
        username: user.username,
        password: '',
        name: user.name,
        admin_role: user.admin_role,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async submit() {
    if (this.user_form.invalid) {
      this.user_form.markAllAsTouched();
      return;
    }

    try {
      if (this.create_mode) {
        const response = await this.authService.createUser(
          this.user_form.value,
        );
        if (response) {
          this.snackbar.open('Usuario creado correctamente', null, {
            duration: 3000,
          });
          this.router.navigate(['/', 'users']);
        }
      } else {
        const response = await this.authService.updateUser({
          ...this.user_form.value,
          _id: this.user_id,
        });
        if (response) {
          this.snackbar.open('Usuario actualizado correctamente', null, {
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
