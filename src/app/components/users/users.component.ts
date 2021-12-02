import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  users;

  constructor(private authService: AuthService, private snackbar: MatSnackBar) {
    this.getUsers();
  }

  async getUsers() {
    try {
      this.users = await this.authService.getUsers();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUser(user_id) {
    try {
      const response = await this.authService.deleteUser(user_id);
      if (response) {
        this.users = this.users.filter((user) => user._id !== user_id);
        this.snackbar.open('Usuario eliminado', null, {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  getUserIcon(isAdmin) {
    return isAdmin ? 'admin_panel_settings' : 'person';
  }

  getTooltip(isAdmin) {
    return isAdmin ? 'Administrador' : 'Invitado';
  }
}
