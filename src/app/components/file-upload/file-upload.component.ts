import { HttpEventType } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { InserDocumentsService } from 'src/app/services/inser-documents.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadDialogComponent {
  loading: boolean;
  documentId: string;
  file: File = null;

  @ViewChild('fileUpload')
  fileUploadInput: ElementRef;

  uploadSub: Subscription;
  uploadProgress: number;

  attachedFiles: string[] = [];

  constructor(
    private inserDocumentsService: InserDocumentsService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<FileUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (!data.documentId) {
      this.dialogRef.close();
    }
    this.documentId = data.documentId;
    if (data.attachedFiles) {
      this.attachedFiles = data.attachedFiles;
    }
  }

  async setNewFile(event) {
    try {
      const validFileName = await this.inserDocumentsService.checkFileName(
        event.target.files[0].name,
      );
      if (validFileName) {
        this.file = event.target.files[0];
      } else {
        this.fileUploadInput.nativeElement.value = '';
        this.snackbar.open('El nombre del fichero ya existe', null, {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  uploadFile() {
    try {
      this.loading = !this.loading;
      const upload$ = this.inserDocumentsService
        .attachFile(this.documentId, this.file)
        .pipe(finalize(() => this.reset()));

      this.uploadSub = upload$.subscribe((event) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
        if (event.type === HttpEventType.Response) {
          this.attachedFiles = event.body['attached_files'] || [];
        }
      });
    } catch (error) {
      console.error(error);
      this.snackbar.open('No se pudo procesar el fichero', null, {
        duration: 3000,
      });
    }
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
    this.fileUploadInput.nativeElement.value = '';
  }
}
