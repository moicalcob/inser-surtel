import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-revision-dialog',
  templateUrl: './edit-revision-dialog.component.html',
  styleUrls: ['./edit-revision-dialog.component.scss'],
})
export class EditRevisionDialogComponent {
  revision;
  revisionForm = new FormGroup({
    reason: new FormControl('', Validators.required),
    updated_at: new FormControl('', Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<EditRevisionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (!data.revision) {
      this.dialogRef.close();
    }
    this.revision = data.revision;
    this.revisionForm.setValue({
      reason: this.revision.reason,
      updated_at: this.revision.updated_at,
    });
  }

  save() {
    this.dialogRef.close({ revision: this.revision });
  }
}