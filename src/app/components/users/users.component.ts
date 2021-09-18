import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  users;

  constructor(private authService: AuthService) {
    this.getUsers();
  }

  async getUsers() {
    try {
      this.users = await this.authService.getUsers();
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
