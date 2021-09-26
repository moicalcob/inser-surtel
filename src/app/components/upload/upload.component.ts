import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IngresDocumentsService } from 'src/app/services/ingres-documents.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  fileName = "";
  displayedColumns: string[] = ['CODIGO', 'FASE', 'DENOMINACION', 'REFERENCIA', 'CANTIDAD'];
  dataSource = [];

  fileFormControl = new FormControl(null, [Validators.required])
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
    unidad: new FormControl('')
  });

  constructor(private ingresDocumentsService: IngresDocumentsService) { }

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
    if (this.descriptionFormGroup.invalid) {
      return;
    }

    try {
      const content = this.dataSource.map(row => {
        return {
          ...row,
          UNIDAD: this.descriptionFormGroup.get('unidad').value
        }
      })
      const response = await this.ingresDocumentsService.createIngresDocument(this.descriptionFormGroup.value, 'Prueba final', content);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
}
