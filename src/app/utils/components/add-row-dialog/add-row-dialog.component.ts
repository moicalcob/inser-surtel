import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-row-dialog',
  templateUrl: './add-row-dialog.component.html',
  styleUrls: ['./add-row-dialog.component.scss']
})
export class AddRowDialogComponent {
  rowForm = new FormGroup({
    'CODIGO': new FormControl('', Validators.required),
    'FASE': new FormControl('', Validators.required),
    'DENOMINACION': new FormControl('', Validators.required),
    'CANTIDAD': new FormControl(1, Validators.required),
    'REFERENCIA': new FormControl('', Validators.required),
    'COMENTARIOS': new FormControl(''),
  })

  constructor(public dialogRef: MatDialogRef<AddRowDialogComponent>) { }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    if (this.rowForm.invalid) {
      this.rowForm.markAllAsTouched();
      return
    }
    this.dialogRef.close(this.rowForm.value)
  }
}
