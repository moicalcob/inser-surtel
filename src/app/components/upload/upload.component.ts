import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IngresDocumentsService } from 'src/app/services/ingres-documents.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  fileName = "";
  displayedColumns: string[] = ['CODIGO', 'FASE', 'DENOMINACION', 'C.TOTAL'];
  dataSource = [];

  fileFormControl = new FormControl(null, [Validators.required])
  nameForm = new FormControl('', Validators.required)
  descriptionFormGroup = new FormGroup({
    cod_modulo: new FormControl('', [Validators.required]),
    plano_situacion: new FormControl('', [Validators.required]),
    plano_electrico: new FormControl('', [Validators.required]),
    num_componentes: new FormControl(0, [Validators.required]),
    smds: new FormControl(0, [Validators.required]),
    tht: new FormControl(0, [Validators.required]),
    max_lt: new FormControl(0, [Validators.required]),
    datos_pcb: new FormControl('', [Validators.required]),
    serigrafia: new FormControl('', [Validators.required]),
    reflujo: new FormControl('', [Validators.required]),
    adhesivo: new FormControl('', [Validators.required]),
    ola: new FormControl('', [Validators.required]),
    norma_surtel: new FormControl('', [Validators.required]),
    norma_cliente: new FormControl('', [Validators.required]),
    producto: new FormControl('', [Validators.required]),
    cliente: new FormControl('', [Validators.required]),
    denominacion: new FormControl('', [Validators.required]),
    codigo: new FormControl('', [Validators.required]),
  });

  constructor(
    private ingresDocumentsService: IngresDocumentsService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  fileSelectionChanged(event: any) {
    const file: File = event.target.files[0];

    if (file) {

      this.fileName = file.name;

      const target: DataTransfer = <DataTransfer>(event.target);

      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(target.files[0]);
      reader.onload = (e: any) => {
        const binarystr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        const ingres_json: any[] = [];

        // Clean excel data
        data.forEach((row: any) => {
          const row_cleaned: any = {};
          Object.keys(row).forEach((key: string) => {
            const clave = key.replace(/\s/g, "");
            row_cleaned[clave] = ("" + row[key]).replace(/\s/g, "");
          })
          ingres_json.push(row_cleaned);
        });

        this.dataSource = ingres_json;
      };

    }
  }

  async submit() {
    if (this.descriptionFormGroup.invalid || this.nameForm.invalid) {
      return;
    }
    try {
      const response = await this.ingresDocumentsService.createIngresDocument(this.descriptionFormGroup.value, this.nameForm.value, this.dataSource);
      if (response) {
        this.snackbar.open('Documento creado correctamente', null, {
          duration: 3000
        })
        this.router.navigate(['/', 'home'])
      }
    } catch (error) {
      console.error(error);
    }
  }
}
