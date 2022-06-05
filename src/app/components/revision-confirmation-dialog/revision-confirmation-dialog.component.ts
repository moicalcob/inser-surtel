import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './revision-confirmation-dialog.component.html',
  styleUrls: ['./revision-confirmation-dialog.component.scss'],
})
export class RevisionConfirmationDialogComponent {
  reasonForm = new UntypedFormControl('', Validators.required);

  constructor(
    public dialogRef: MatDialogRef<RevisionConfirmationDialogComponent>,
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    if (this.reasonForm.invalid) {
      this.reasonForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.reasonForm.value);
  }
}
