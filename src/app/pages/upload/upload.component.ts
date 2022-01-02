import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { InserDocumentsService } from 'src/app/services/inser-documents.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  fileName = '';
  displayedColumns: string[] = [
    'CODIGO',
    'FASE',
    'DENOMINACION',
    'REFERENCIA',
    'CANTIDAD',
  ];
  dataSource = [];

  fileFormControl = new FormControl(null, [Validators.required]);
  nameForm = new FormControl('', Validators.required);
  descriptionFormGroup = new FormGroup({
    modulo: new FormControl('', [Validators.required]),
    codigo: new FormControl('', [Validators.required]),
    producto: new FormControl('', [Validators.required]),
    cliente: new FormControl('', [Validators.required]),
    // DOCUMENTACIÓN APLICABLE
    lista_piezas: new FormControl('', [Validators.required]),
    plano_situacion: new FormControl('', [Validators.required]),
    plano_electrico: new FormControl('', [Validators.required]),
    lista_piezas_edicion: new FormControl('VER HL', [Validators.required]),
    plano_situacion_edicion: new FormControl('VER HL', [Validators.required]),
    plano_electrico_edicion: new FormControl('VER HL', [Validators.required]),
    // PROGRAMAS DE INSERTADO SMD Y TRADICIONAL
    smd_comp: new FormControl('', [Validators.required]),
    smd_sold: new FormControl('', [Validators.required]),
    tradic: new FormControl('', [Validators.required]),
    num_componentes: new FormControl(0, [Validators.required]),
    smds: new FormControl(0, [Validators.required]),
    smdc: new FormControl(0, [Validators.required]),
    datos_pcb: new FormControl('', [Validators.required]),
    serigrafia: new FormControl('', [Validators.required]),
    reflujo: new FormControl('', [Validators.required]),
    adhesivo: new FormControl('', [Validators.required]),
    ola: new FormControl('', [Validators.required]),
    preformado_max: new FormControl('', [Validators.required]),
    // NORMATIVA GENERAL APLICABLE AL PRODUCTO (WORKMANSHIP)
    norma_surtel: new FormControl('', [Validators.required]),
    norma_cliente: new FormControl('', [Validators.required]),
    id_documento_externo: new FormControl('', [Validators.required]),
    // CAMPO PEDIDO
    unidad: new FormControl('uds'),
    trazabilidad: new FormControl('', [Validators.required]),
  });

  constructor(
    private inserDocumentsService: InserDocumentsService,
    private router: Router,
    private snackbar: MatSnackBar,
  ) {}

  fileSelectionChanged(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      const target: DataTransfer = event.target as DataTransfer;

      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(target.files[0]);
      reader.onload = (e: any) => {
        const binarystr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        const inser_json: any[] = [];

        // Clean excel data
        data.forEach((row: any) => {
          const row_cleaned: any = {};
          Object.keys(row).forEach((key: string) => {
            const clave = key.replace(/\s/g, '');
            row_cleaned[clave] = '' + row[key];
          });
          inser_json.push(row_cleaned);
        });

        if (inser_json.filter((x) => x.COMENTARIOS).length > 0) {
          this.displayedColumns.push('COMENTARIOS');
          inser_json.forEach((x) => {
            if (x.COMENTARIOS) return;
            x.COMENTARIOS = '';
          });
        }

        this.dataSource = inser_json;
        console.log(inser_json);
      };
    }
  }

  async submit() {
    if (this.descriptionFormGroup.invalid || this.nameForm.invalid) {
      return;
    }
    try {
      const content = this.dataSource.map((row) => {
        return {
          ...row,
          UNIDAD: this.descriptionFormGroup.get('unidad').value,
          type: 'component',
        };
      });
      const response = await this.inserDocumentsService.createInserDocument(
        this.descriptionFormGroup.value,
        this.nameForm.value,
        content,
      );
      if (response) {
        this.snackbar.open('Documento creado correctamente', null, {
          duration: 3000,
        });
        this.router.navigate(['/', 'home']);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
