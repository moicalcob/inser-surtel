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
import { ConfirmationDialogComponent } from 'src/app/utils/components/confirmation-dialog/confirmation-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentsComponent implements AfterViewInit {

  documents: any[] = [];

  displayedColumns: string[] = ['select', 'name', 'codigo', 'created_at', 'last_modification', 'revisions', 'actions'];
  dataSource = new MatTableDataSource(this.documents);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<any>(true, []);

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
      if (!documentName) return;
      const response = await this.inserDocumentsService.duplicateInserDocument(document_id, documentName);
      if (response) {
        this.snackbar.open('Documento duplicado correctamente', null, {
          duration: 3000
        })
        this.getAllDocuments();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteDocument(document_id) {
    try {
      const dialog = this.dialog.open(ConfirmationDialogComponent);
      const confirmation = await dialog.afterClosed().toPromise();
      if (!confirmation) return;
      const response = await this.inserDocumentsService.deleteInserDocument(document_id);
      if (response) {
        this.snackbar.open('Documento eliminado correctamente', null, {
          duration: 3000
        })
        this.getAllDocuments();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async generateNeededPieces() {
    try {
      const documentsIds = this.selection.selected.map(document => document._id);
      const response = await this.inserDocumentsService.getResumeOfNeededPieces(documentsIds);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(response);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Resumen de necesidades');
      const name = `${this.selection.selected.map(document => document.name).join(' - ')}_${new Date().toLocaleDateString()}.xlsx`
      XLSX.writeFile(wb, name);
    } catch (error) {
      console.error(error)
    }
  }

  reloadTableData() {
    this.dataSource = new MatTableDataSource(this.documents);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      const dataStr = (data.name + data.description.id_documento).toLowerCase();

      const transformedFilter = filter.trim().toLowerCase();

      return dataStr.indexOf(transformedFilter) != -1;
    }
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
