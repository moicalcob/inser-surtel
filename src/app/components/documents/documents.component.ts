import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IngresDocumentsService } from 'src/app/services/ingres-documents.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DownloadDocumentService } from 'src/app/services/download-document.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private ingresDocumentsService: IngresDocumentsService,
    private downloadDocumentService: DownloadDocumentService
  ) {
    this.getAllDocuments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getAllDocuments() {
    try {
      this.documents = await this.ingresDocumentsService.getAllIngresDocuments();
      this.reloadTableData();
    } catch (error) {
      console.log(error);
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
    this.downloadDocumentService.downloadAsPDF(document);
  }

}
