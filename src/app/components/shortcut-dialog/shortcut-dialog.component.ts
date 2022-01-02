import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { InserDocumentsService } from 'src/app/services/inser-documents.service';

@Component({
  selector: 'app-shortcut-dialog',
  templateUrl: './shortcut-dialog.component.html',
  styleUrls: ['./shortcut-dialog.component.scss'],
})
export class ShortcutDialogComponent {
  private documentQuerySubject = new Subject<string>();

  readonly documents$ = this.documentQuerySubject.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    switchMap((query) => this.inserDocumentsService.seachInserDocuments(query)),
  );

  constructor(
    private inserDocumentsService: InserDocumentsService,
    private router: Router,
  ) {}

  searchDocuments(query: string) {
    this.documentQuerySubject.next(query);
  }

  goToDocument(id: string) {
    this.router.navigate([]).then((result) => {
      window.open(`/document/${id}`, '_blank');
    });
  }
}
