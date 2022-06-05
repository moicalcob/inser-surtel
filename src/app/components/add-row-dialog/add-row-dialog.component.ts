import { Component, Inject } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-row-dialog',
  templateUrl: './add-row-dialog.component.html',
  styleUrls: ['./add-row-dialog.component.scss'],
})
export class AddRowDialogComponent {
  rowType = new UntypedFormControl('component');

  rowFormComponent = new UntypedFormGroup({
    CODIGO: new UntypedFormControl('', Validators.required),
    FASE: new UntypedFormControl('', Validators.required),
    DENOMINACION: new UntypedFormControl('', Validators.required),
    CANTIDAD: new UntypedFormControl(1, Validators.required),
    REFERENCIA: new UntypedFormControl('', Validators.required),
    UNIDAD: new UntypedFormControl('', Validators.required),
    COMENTARIOS: new UntypedFormControl(''),
  });

  rowFormText = new UntypedFormGroup({
    CONTENIDO: new UntypedFormControl('', Validators.required),
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
