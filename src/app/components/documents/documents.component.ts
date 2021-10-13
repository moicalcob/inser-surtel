import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InserDocumentsService } from 'src/app/services/inser-documents.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DownloadDocumentService } from 'src/app/services/download-document.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DuplicateDocumentDialogComponent } from 'src/app/utils/components/duplicate-document-dialog/duplicate-document-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentsComponent implements AfterViewInit {

  documents: any[] = [];

  displayedColumns: string[] = ['name', 'created_at', 'last_modification', 'revisions', 'actions'];
  dataSource = new MatTableDataSource(this.documents);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public authService: AuthService,
    private inserDocumentsService: InserDocumentsService,
    private downloadDocumentService: DownloadDocumentService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {
    this.getAllDocuments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getAllDocuments() {
    try {
      this.documents = await this.inserDocumentsService.getAllInserDocuments();
      this.reloadTableData();
    } catch (error) {
      console.error(error);
    }
  }

  async duplicateDocument(document_id) {
    try {
      const dialog = this.dialog.open(DuplicateDocumentDialogComponent);
      const documentName = await dialog.afterClosed().toPromise();
      if(!documentName) return;
      const response = await this.inserDocumentsService.duplicateInserDocument(document_id, documentName);
      if(response) {
        this.snackbar.open('Documento duplicado correctamente', null, {
          duration: 3000
        })
        this.getAllDocuments();
      }
    } catch (error) {
      console.error(error);
    }
  }

  reloadTableData() {
    this.dataSource = new MatTableDataSource(this.documents);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  downloadDocument(document) {
    this.downloadDocumentService.downloadAsPDF(document._id);
  }

}
