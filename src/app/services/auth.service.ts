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
    return this.httpClient.post<boolean>(environment.API_URL + '/auth/create', user).toPromise();
  }

  public updateUser(user: UserInterface): Promise<boolean> {
    return this.httpClient.put<boolean>(environment.API_URL + '/auth/user/' + user._id, user).toPromise();
  }

  public deleteUser(user_id: string): Promise<boolean> {
    return this.httpClient.delete<boolean>(environment.API_URL + '/auth/user/' + user_id).toPromise();
  }

  public getUsers(): Promise<any[]> {
    return this.httpClient.get<any[]>(environment.API_URL + '/auth/users').toPromise();
  }

  public getUser(user_id): Promise<any> {
    return this.httpClient.get<any>(environment.API_URL + '/auth/user/' + user_id).toPromise();
  }

  public isLogged(): boolean {
    return localStorage.getItem('user') != null;
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/', 'login'])
  }

  public isAdmin(): boolean {
    return JSON.parse(localStorage.getItem('user'))?.admin_role;
  }

  public getToken(): string | null {
    return JSON.parse(localStorage.getItem('user'))?.access_token;
  }

  public getUserName(): string {
    return JSON.parse(localStorage.getItem('user'))?.name;
  }
}
