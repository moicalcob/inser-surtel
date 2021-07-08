import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  descriptionFormGroup = new FormGroup({});

  constructor() { }

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

        console.log(ingres_json);
        this.dataSource = ingres_json;
      };

    }
  }
}
