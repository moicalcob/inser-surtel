import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-duplicate-document-dialog',
  templateUrl: './duplicate-document-dialog.component.html',
  styleUrls: ['./duplicate-document-dialog.component.scss'],
})
export class DuplicateDocumentDialogComponent {
  nameForm = new FormControl('', Validators.required);

  constructor(
    public dialogRef: MatDialogRef<DuplicateDocumentDialogComponent>,
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    if (this.nameForm.invalid) {
      this.nameForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.nameForm.value);
  }
}
