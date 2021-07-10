import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngresDocumentsService {

  constructor(private httpClient: HttpClient) { }

  public getAllIngresDocuments(): Promise<any> {
    return this.httpClient.get(environment.API_URL + '/ingres-document').toPromise();
  }
}
