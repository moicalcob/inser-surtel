import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DocumentDescription } from '../interfaces/document-description';

@Injectable({
  providedIn: 'root',
})
export class InserDocumentsService {
  constructor(private httpClient: HttpClient) {}

  public getAllInserDocuments(): Promise<any> {
    return this.httpClient
      .get(environment.API_URL + '/inser-document')
      .toPromise();
  }

  public seachInserDocuments(query): Observable<any[]> {
    return this.httpClient
      .get<any[]>(environment.API_URL + '/inser-document', {
        params: {
          q: query,
        },
      })
      .pipe(catchError((err) => of([])));
  }
  public getResumeOfNeededPieces(documents: string[]): Promise<any> {
    const body = {
      documents,
    };
    return this.httpClient
      .post(environment.API_URL + '/inser-document/needed-pieces', body)
      .toPromise();
  }

  public getInserDocumentById(documentId: string): Promise<any> {
    return this.httpClient
      .get(environment.API_URL + '/inser-document/' + documentId)
      .toPromise();
  }

  public createInserDocument(
    description: DocumentDescription,
    name: string,
    content: any[],
  ): Promise<any> {
    const body = {
      description,
      name,
      content,
    };
    return this.httpClient
      .post(environment.API_URL + '/inser-document', body)
      .toPromise();
  }

  public updateInserDocument(
    description: DocumentDescription,
    content: any[],
    name: string,
    documentId: string,
  ): Promise<any> {
    const body = {
      description,
      content,
      name,
    };
    return this.httpClient
      .put(environment.API_URL + '/inser-document/' + documentId, body)
      .toPromise();
  }

  public createInserDocumentRevision(
    description: DocumentDescription,
    content: any[],
    documentId: string,
    name: string,
    reason: string,
  ): Promise<any> {
    const body = {
      description,
      content,
      reason,
      name,
    };
    return this.httpClient
      .post(
        environment.API_URL + '/inser-document/revision/' + documentId,
        body,
      )
      .toPromise();
  }

  public duplicateInserDocument(
    documentId: string,
    documentName: string,
  ): Promise<any> {
    const body = {
      documentId,
      documentName,
    };
    return this.httpClient
      .post(environment.API_URL + '/inser-document/duplicate', body)
      .toPromise();
  }

  public deleteInserDocument(documentId: string): Promise<any> {
    return this.httpClient
      .delete(environment.API_URL + '/inser-document/' + documentId)
      .toPromise();
  }

  public activateRevision(
    sourceDocumentId: string,
    revision: any,
  ): Promise<any> {
    return this.httpClient
      .post(
        environment.API_URL +
          '/inser-document/' +
          sourceDocumentId +
          '/activate-revision',
        { revision },
      )
      .toPromise();
  }

  public attachFile(documentId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.post(
      environment.API_URL + '/inser-document/' + documentId + '/attach-file',
      formData,
      {
        reportProgress: true,
        observe: 'events',
      },
    );
  }

  public checkFileName(documentId: string, fileName: string): Promise<boolean> {
    return this.httpClient
      .get<boolean>(
        environment.API_URL + `/inser-document/${documentId}/check-file-name`,
        {
          params: {
            fileName,
          },
        },
      )
      .toPromise();
  }

  public downloadFiles(documentId: string): Observable<Blob> {
    return this.httpClient.get(
      environment.API_URL + '/inser-document/download/' + documentId,
      {
        responseType: 'blob',
      },
    );
  }

  public updateRevision(revision): Promise<any> {
    return this.httpClient
      .post(
        environment.API_URL + '/inser-document/edit-revision/' + revision._id,
        { revision },
      )
      .toPromise();
  }
}
