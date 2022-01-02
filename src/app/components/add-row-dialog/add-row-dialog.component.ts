import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-row-dialog',
  templateUrl: './add-row-dialog.component.html',
  styleUrls: ['./add-row-dialog.component.scss'],
})
export class AddRowDialogComponent {
  rowType = new FormControl('component');

  rowFormComponent = new FormGroup({
    CODIGO: new FormControl('', Validators.required),
    FASE: new FormControl('', Validators.required),
    DENOMINACION: new FormControl('', Validators.required),
    CANTIDAD: new FormControl(1, Validators.required),
    REFERENCIA: new FormControl('', Validators.required),
    UNIDAD: new FormControl('', Validators.required),
    COMENTARIOS: new FormControl(''),
  });

  rowFormText = new FormGroup({
    CONTENIDO: new FormControl('', Validators.required),
  });

  units = [
    {
      text: 'Unidades',
      value: 'uds',
    },
    {
      text: 'Mililítros',
      value: 'ml',
    },
    {
      text: 'Gramos',
      value: 'g',
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<AddRowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data) {
      if (data.type === 'component') {
        this.rowType.setValue('component');
        this.rowFormComponent.setValue({
          CODIGO: data.CODIGO || '',
          FASE: data.FASE || '',
          DENOMINACION: data.DENOMINACION || '',
          CANTIDAD: data.CANTIDAD || 1,
          REFERENCIA: data.REFERENCIA || '',
          UNIDAD: data.UNIDAD.value || '',
          COMENTARIOS: data.COMENTARIOS.value || '',
        });
      } else {
        this.rowType.setValue('text');
        this.rowFormText.setValue({
          CONTENIDO: data.CONTENIDO.value || '',
        });
      }
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    const form =
      this.rowType.value === 'component'
        ? this.rowFormComponent
        : this.rowFormText;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    this.dialogRef.close({
      ...form.value,
      type: this.rowType.value,
    });
  }
}
