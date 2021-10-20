import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { InserDocumentsService } from 'src/app/services/inser-documents.service';
import { RevisionConfirmationDialogComponent } from 'src/app/utils/components/revision-confirmation-dialog/revision-confirmation-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { AddRowDialogComponent } from 'src/app/utils/components/add-row-dialog/add-row-dialog.component';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.scss']
})
export class EditDocumentComponent {

  loaded = false;

  document;
  documentId;
  displayedColumns: string[] = ['position', 'CODIGO', 'FASE', 'DENOMINACION',
    'REFERENCIA', 'CANTIDAD', 'UNIDAD', 'COMENTARIOS', 'MSD', 'actions'];
  dataSource = [];
  @ViewChild('table') table: MatTable<any>;

  units = [
    {
      text: 'Unidades',
      value: 'uds'
    },
    {
      text: 'Mililítros',
      value: 'ml'
    }, {
      text: 'Gramos',
      value: 'g'
    }
  ]

  msd_choices = [1, 2, 3, 4, 5, 6]

  name = new FormControl('', Validators.required);
  descriptionFormGroup = new FormGroup({
    cod_modulo: new FormControl('', [Validators.required]),
    plano_situacion: new FormControl('', [Validators.required]),
    plano_electrico: new FormControl('', [Validators.required]),
    plano_situacion_edicion: new FormControl('VER HL', [Validators.required]),
    plano_electrico_edicion: new FormControl('VER HL', [Validators.required]),
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
    smd_comp: new FormControl('', [Validators.required]),
    smd_sold: new FormControl('', [Validators.required]),
    tradic: new FormControl('', [Validators.required]),
    trazabilidad: new FormControl('', [Validators.required]),
  });

  constructor(
    private inserDocumentsService: InserDocumentsService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _snackbar: MatSnackBar,
    public authService: AuthService
  ) {
    this.getDocument();
  }

  async getDocument() {
    try {
      this.documentId = this.route.snapshot.params['document_id'];
      this.document = await this.inserDocumentsService.getInserDocumentById(this.documentId);
      this.initDocumentForm();
    } catch (error) {
      console.error(error);
    }
  }

  async updateDocument() {
    try {
      const new_content = this.getNewContent()
      const response = await this.inserDocumentsService
        .updateInserDocument(this.descriptionFormGroup.value, new_content, this.name.value, this.documentId)
      if (response) {
        this._snackbar.open('Documento actualizado correctamente', null, {
          duration: 3000
        })
        this.getDocument();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async createDocumentVersion() {
    try {
      // Confirmation dialog
      const dialogRef = this.dialog.open(RevisionConfirmationDialogComponent, {
        width: '250px',
      });

      const reason = await dialogRef.afterClosed().toPromise();

      if (!reason) {
        return;
      }
      const new_content = this.getNewContent()
      const response = await this.inserDocumentsService
        .createInserDocumentRevision(this.descriptionFormGroup.value, new_content, this.documentId, this.name.value, reason)
      if (response) {
        this._snackbar.open('Revisión creada correctamente', null, {
          duration: 3000
        })
        this.getDocument();
      }
    } catch (error) {
      console.error(error);
    }
  }

  private initDocumentForm() {
    this.name.setValue(this.document.name);
    this.descriptionFormGroup.setValue({
      cod_modulo: this.document.description.cod_modulo || '',
      plano_situacion: this.document.description.plano_situacion || '',
      plano_electrico: this.document.description.plano_electrico || '',
      plano_situacion_edicion: this.document.description.plano_situacion_edicion || 'VER HL',
      plano_electrico_edicion: this.document.description.plano_electrico_edicion || 'VER HL',
      num_componentes: this.document.description.num_componentes || 0,
      smds: this.document.description.smds || 0,
      tht: this.document.description.tht || 0,
      max_lt: this.document.description.max_lt || 0,
      datos_pcb: this.document.description.datos_pcb || '',
      serigrafia: this.document.description.serigrafia || '',
      reflujo: this.document.description.reflujo || '',
      adhesivo: this.document.description.adhesivo || '',
      ola: this.document.description.ola || '',
      norma_surtel: this.document.description.norma_surtel || '',
      norma_cliente: this.document.description.norma_cliente || '',
      producto: this.document.description.producto || '',
      cliente: this.document.description.cliente || '',
      denominacion: this.document.description.denominacion || '',
      codigo: this.document.description.codigo || '',
      smd_comp: this.document.description.smd_comp || '',
      smd_sold: this.document.description.smd_sold || '',
      tradic: this.document.description.tradic || '',
      trazabilidad: this.document.description.trazabilidad || ''
    })
    this.generateContentFormArray(this.document.content);
    this.loaded = true;
  }

  private generateContentFormArray(content) {
    this.dataSource = content.map(row => {
      return {
        ...row,
        'UNIDAD': new FormControl(row['UNIDAD'] || null),
        'COMENTARIOS': new FormControl(row['COMENTARIOS'] || null),
        'MSD': new FormControl(row['MSD'] || null),
        'CONTENIDO': new FormControl(row['CONTENIDO'] || null)
      }
    })
  }

  private getNewContent() {
    return this.dataSource.map(row => {
      return {
        ...row,
        'UNIDAD': row['UNIDAD'].value,
        'COMENTARIOS': row['COMENTARIOS'].value,
        'MSD': row['MSD'].value,
        'CONTENIDO': row['CONTENIDO'].value,
      }
    })
  }

  dropTable(event: CdkDragDrop<any[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  deleteRow(element) {
    this.dataSource = this.dataSource.filter(row => row !== element);
    this.table.renderRows();
  }

  async addRow() {
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      width: '450px',
    });

    let result = await dialogRef.afterClosed().toPromise();
    if (result) {
      result = {
        ...result,
        'UNIDAD': new FormControl(result['UNIDAD']),
        'COMENTARIOS': new FormControl(result['COMENTARIOS']),
        'MSD': new FormControl(result['MSD']),
        'CONTENIDO': new FormControl(result['CONTENIDO'])
      }
      this.dataSource.push(result);
      this.table.renderRows();
    }
  }

  restoreRevision(revision) {
    this.document.content = revision.content;
    Object.keys(this.document.description).forEach(key => {
      this.document.description[key] = revision.description[key];
    })
    this.initDocumentForm();
    this.table.renderRows();
    this._snackbar.open('Revisión restaurada correctamente', null, {
      duration: 3000
    })
  }

}
