import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtTokenInterface } from '../interfaces/jwt-token-response';
import { UserInterface } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private router: Router) { }

  public login(username: string, password: string): Promise<JwtTokenInterface> {
    return this.httpClient.post<JwtTokenInterface>(environment.API_URL + '/auth/login', {
      username: username,
      password: password
    }).toPromise();
  }

  public createUser(user: UserInterface): Promise<boolean> {
    return this.httpClient.post<boolean>(environment.API_URL + '/auth/create', {
      user: user
    }).toPromise();
  }

  public isLogged() {
    return localStorage.getItem('user') != null;
  }

  public logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/', 'login'])
  }

  public isAdmin() {
    return true;
  }
}
