import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-revision-dialog',
  templateUrl: './edit-revision-dialog.component.html',
  styleUrls: ['./edit-revision-dialog.component.scss'],
})
export class EditRevisionDialogComponent {
  revision;
  reason = new UntypedFormControl('', Validators.required);
  date;

  constructor(
    public dialogRef: MatDialogRef<EditRevisionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (!data.revision) {
      this.dialogRef.close();
    }
    this.revision = data.revision;
    this.reason.setValue(this.revision.reason);
    this.date = this.revision.updated_at;
  }

  dateChanged(eventDate: string): Date | null {
    return !!eventDate ? new Date(eventDate) : null;
  }

  save() {
    const revision = {
      ...this.revision,
      updated_at: this.date,
      reason: this.reason.value,
    };
    this.dialogRef.close({ revision });
  }

  cancel() {
    this.dialogRef.close();
  }
}
