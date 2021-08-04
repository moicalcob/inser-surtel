import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DocumentDescription } from '../interfaces/document-description';

@Injectable({
  providedIn: 'root'
})
export class IngresDocumentsService {

  constructor(private httpClient: HttpClient) { }

  public getAllIngresDocuments(): Promise<any> {
    return this.httpClient.get(environment.API_URL + '/ingres-document').toPromise();
  }

  public getIngresDocumentById(documentId: string) {
    return this.httpClient.get(environment.API_URL + '/ingres-document/' + documentId).toPromise();
  }

  public createIngresDocument(description: DocumentDescription, name: string, content: any[]): Promise<any> {
    const body = {
      description: description,
      name: name,
      content: content
    }
    return this.httpClient.post(environment.API_URL + '/ingres-document', body).toPromise();
  }
}
