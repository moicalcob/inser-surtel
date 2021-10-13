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

  public updateIngresDocument(description: DocumentDescription, content: any[], documentId: string, reason: string): Promise<any> {
    const body = {
      description: description,
      content: content,
      reason: reason
    }
    return this.httpClient.put(environment.API_URL + '/ingres-document/' + documentId, body).toPromise();
  }

  public duplicateIngresDocument(documentId: string, documentName: string) {
    const body = {
      documentId: documentId,
      documentName: documentName
    }
    return this.httpClient.post(environment.API_URL + '/ingres-document/duplicate', body).toPromise();
  }
}
