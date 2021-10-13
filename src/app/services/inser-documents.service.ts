import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DocumentDescription } from '../interfaces/document-description';

@Injectable({
  providedIn: 'root'
})
export class InserDocumentsService {

  constructor(private httpClient: HttpClient) { }

  public getAllInserDocuments(): Promise<any> {
    return this.httpClient.get(environment.API_URL + '/inser-document').toPromise();
  }

  public getInserDocumentById(documentId: string) {
    return this.httpClient.get(environment.API_URL + '/inser-document/' + documentId).toPromise();
  }

  public createInserDocument(description: DocumentDescription, name: string, content: any[]): Promise<any> {
    const body = {
      description: description,
      name: name,
      content: content
    }
    return this.httpClient.post(environment.API_URL + '/inser-document', body).toPromise();
  }

  public updateInserDocument(description: DocumentDescription, content: any[], documentId: string, reason: string): Promise<any> {
    const body = {
      description: description,
      content: content,
      reason: reason
    }
    return this.httpClient.put(environment.API_URL + '/inser-document/' + documentId, body).toPromise();
  }

  public duplicateInserDocument(documentId: string, documentName: string) {
    const body = {
      documentId: documentId,
      documentName: documentName
    }
    return this.httpClient.post(environment.API_URL + '/inser-document/duplicate', body).toPromise();
  }
}
