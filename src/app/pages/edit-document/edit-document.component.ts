import { Component, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { InserDocumentsService } from 'src/app/services/inser-documents.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { AddRowDialogComponent } from 'src/app/components/add-row-dialog/add-row-dialog.component';
import { RowCopyService } from 'src/app/services/row-copy.service';
import { RevisionConfirmationDialogComponent } from 'src/app/components/revision-confirmation-dialog/revision-confirmation-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { FileUploadDialogComponent } from 'src/app/components/file-upload-dialog/file-upload-dialog.component';
import { EditRevisionDialogComponent } from 'src/app/components/edit-revision-dialog/edit-revision-dialog.component';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.scss'],
})
export class EditDocumentComponent {
  loaded = false;

  document;
  documentId;
  displayedColumns: string[] = [
    'position',
    'CODIGO',
    'FASE',
    'DENOMINACION',
    'REFERENCIA',
    'CANTIDAD',
    'UNIDAD',
    'COMENTARIOS',
    'MSD',
    'actions',
  ];
  dataSource = [];
  @ViewChild('table') table: MatTable<any>;

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

  msd_choices = [1, 2, 3, 4, 5, 6];

  name = new UntypedFormControl('', Validators.required);
  descriptionFormGroup = new UntypedFormGroup({
    modulo: new UntypedFormControl('', [Validators.required]),
    codigo: new UntypedFormControl('', [Validators.required]),
    producto: new UntypedFormControl('', [Validators.required]),
    cliente: new UntypedFormControl('', [Validators.required]),
    // DOCUMENTACIÓN APLICABLE
    lista_piezas: new UntypedFormControl('', [Validators.required]),
    plano_situacion: new UntypedFormControl('', [Validators.required]),
    plano_electrico: new UntypedFormControl('', [Validators.required]),
    lista_piezas_edicion: new UntypedFormControl('VER HL', [
      Validators.required,
    ]),
    plano_situacion_edicion: new UntypedFormControl('VER HL', [
      Validators.required,
    ]),
    plano_electrico_edicion: new UntypedFormControl('VER HL', [
      Validators.required,
    ]),
    // PROGRAMAS DE INSERTADO SMD Y TRADICIONAL
    smd_comp: new UntypedFormControl('', [Validators.required]),
    smd_sold: new UntypedFormControl('', [Validators.required]),
    tradic: new UntypedFormControl('', [Validators.required]),
    num_componentes: new UntypedFormControl(0, [Validators.required]),
    smds: new UntypedFormControl(0, [Validators.required]),
    smdc: new UntypedFormControl(0, [Validators.required]),
    datos_pcb: new UntypedFormControl('', [Validators.required]),
    serigrafia: new UntypedFormControl('', [Validators.required]),
    reflujo: new UntypedFormControl('', [Validators.required]),
    adhesivo: new UntypedFormControl('', [Validators.required]),
    ola: new UntypedFormControl('', [Validators.required]),
    preformado_max: new UntypedFormControl('', [Validators.required]),
    // NORMATIVA GENERAL APLICABLE AL PRODUCTO (WORKMANSHIP)
    norma_surtel: new UntypedFormControl('', [Validators.required]),
    norma_cliente: new UntypedFormControl('', [Validators.required]),
    id_documento: new UntypedFormControl('', [Validators.required]),
    id_documento_externo: new UntypedFormControl('', [Validators.required]),
    // CAMPO PEDIDO
    trazabilidad: new UntypedFormControl('', [Validators.required]),
  });

  constructor(
    private inserDocumentsService: InserDocumentsService,
    public copyRowService: RowCopyService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _snackbar: MatSnackBar,
    public authService: AuthService,
    private router: Router,
  ) {
    this.getDocument();
  }

  async getDocument() {
    try {
      this.documentId = this.route.snapshot.params.document_id;
      this.document = await this.inserDocumentsService.getInserDocumentById(
        this.documentId,
      );
      this.initDocumentForm();
    } catch (error) {
      console.error(error);
    }
  }

  async updateDocument() {
    try {
      const new_content = this.getNewContent();
      const response = await this.inserDocumentsService.updateInserDocument(
        this.descriptionFormGroup.value,
        new_content,
        this.name.value,
        this.documentId,
      );
      if (response) {
        this._snackbar.open('Documento actualizado correctamente', null, {
          duration: 3000,
        });
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
      const new_content = this.getNewContent();
      const response =
        await this.inserDocumentsService.createInserDocumentRevision(
          this.descriptionFormGroup.value,
          new_content,
          this.documentId,
          this.name.value,
          reason,
        );
      if (response) {
        this._snackbar.open('Revisión creada correctamente', null, {
          duration: 3000,
        });
        this.getDocument();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async markActiveRevision(revision) {
    try {
      // Confirmation dialog
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '250px',
        data: {
          title: 'Activar revisión',
          text: '¿Seguro que quieres marcar esta revisión como activa?',
        },
      });

      const reason = await dialogRef.afterClosed().toPromise();

      if (!reason) {
        return;
      }
      const response = await this.inserDocumentsService.activateRevision(
        this.documentId,
        revision,
      );
      if (response) {
        this._snackbar.open('Revisión activada correctamente', null, {
          duration: 3000,
        });
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error(error);
    }
  }

  private initDocumentForm() {
    this.name.setValue(this.document.name);
    this.descriptionFormGroup.setValue({
      modulo: this.document.description.modulo || '',
      codigo: this.document.description.codigo || '',
      producto: this.document.description.producto || '',
      cliente: this.document.description.cliente || '',
      lista_piezas: this.document.description.lista_piezas || '',
      plano_situacion: this.document.description.plano_situacion || '',
      plano_electrico: this.document.description.plano_electrico || '',
      lista_piezas_edicion:
        this.document.description.lista_piezas_edicion || 'VER HL',
      plano_situacion_edicion:
        this.document.description.plano_situacion_edicion || 'VER HL',
      plano_electrico_edicion:
        this.document.description.plano_electrico_edicion || 'VER HL',
      smd_comp: this.document.description.smd_comp || '',
      smd_sold: this.document.description.smd_sold || '',
      tradic: this.document.description.tradic || '',
      num_componentes: this.document.description.num_componentes || 0,
      smds: this.document.description.smds || 0,
      smdc: this.document.description.smdc || 0,
      datos_pcb: this.document.description.datos_pcb || '',
      serigrafia: this.document.description.serigrafia || '',
      reflujo: this.document.description.reflujo || '',
      adhesivo: this.document.description.adhesivo || '',
      ola: this.document.description.ola || '',
      preformado_max: this.document.description.preformado_max || '',
      norma_surtel: this.document.description.norma_surtel || '',
      norma_cliente: this.document.description.norma_cliente || '',
      id_documento: this.document.description.id_documento || '',
      id_documento_externo:
        this.document.description.id_documento_externo || '',
      trazabilidad: this.document.description.trazabilidad || '',
    });
    this.generateContentFormArray(this.document.content);
    this.loaded = true;
  }

  private generateContentFormArray(content) {
    this.dataSource = content.map((row) => {
      return {
        ...row,
        UNIDAD: new UntypedFormControl(row.UNIDAD || null),
        COMENTARIOS: new UntypedFormControl(row.COMENTARIOS || null),
        MSD: new UntypedFormControl(row.MSD || null),
        CONTENIDO: new UntypedFormControl(row.CONTENIDO || null),
      };
    });
  }

  private getNewContent() {
    return this.dataSource.map((row) => {
      return {
        ...row,
        UNIDAD: row.UNIDAD.value,
        COMENTARIOS: row.COMENTARIOS.value,
        MSD: row.MSD.value,
        CONTENIDO: row.CONTENIDO.value,
      };
    });
  }

  dropTable(event: CdkDragDrop<any[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  deleteRow(element) {
    this.dataSource = this.dataSource.filter((row) => row !== element);
    this.table.renderRows();
  }

  copyRow(element) {
    const copiedRow = {
      ...element,
      COMENTARIOS: element?.COMENTARIOS?.value || '',
      CONTENIDO: element?.CONTENIDO?.value || '',
      MSD: element?.MSD?.value || '',
      UNIDAD: element?.UNIDAD?.value || '',
    };
    this.copyRowService.storeCopiedRow(copiedRow);
    this._snackbar.open('Fila copiada', null, {
      duration: 3000,
    });
  }

  pasteRow(position: string) {
    const copiedRow = this.copyRowService.getCopiedRow();
    const rowToPaste = {
      ...copiedRow,
      UNIDAD: new UntypedFormControl(copiedRow.UNIDAD),
      COMENTARIOS: new UntypedFormControl(copiedRow.COMENTARIOS),
      MSD: new UntypedFormControl(copiedRow.MSD),
      CONTENIDO: new UntypedFormControl(copiedRow.CONTENIDO),
    };
    if (position === 'start') {
      this.dataSource.unshift(rowToPaste);
    } else if (position === 'end') {
      this.dataSource.push(rowToPaste);
    }
    this.table.renderRows();
    this._snackbar.open('Fila pegada tras el último elemento', null, {
      duration: 3000,
    });
  }

  async addRow() {
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      width: '450px',
    });

    let result = await dialogRef.afterClosed().toPromise();
    if (result) {
      result = {
        ...result,
        UNIDAD: new UntypedFormControl(result.UNIDAD),
        COMENTARIOS: new UntypedFormControl(result.COMENTARIOS),
        MSD: new UntypedFormControl(result.MSD),
        CONTENIDO: new UntypedFormControl(result.CONTENIDO),
      };
      this.dataSource.push(result);
      this.table.renderRows();
    }
  }

  async editRow(row, index) {
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      width: '450px',
      data: row,
    });

    let result = await dialogRef.afterClosed().toPromise();
    if (result) {
      row = {
        ...result,
        UNIDAD: new UntypedFormControl(result.UNIDAD),
        COMENTARIOS: new UntypedFormControl(result.COMENTARIOS),
        MSD: new UntypedFormControl(result.MSD),
        CONTENIDO: new UntypedFormControl(result.CONTENIDO),
      };
      this.dataSource[index] = row;
      this.table.renderRows();
    }
  }

  restoreRevision(revision) {
    this.document.content = revision.content;
    Object.keys(this.document.description).forEach((key) => {
      this.document.description[key] = revision.description[key];
    });
    this.initDocumentForm();
    this.table.renderRows();
    this._snackbar.open('Revisión restaurada correctamente', null, {
      duration: 3000,
    });
  }

  attachFiles() {
    this.dialog.open(FileUploadDialogComponent, {
      width: '450px',
      data: {
        documentId: this.document._id,
        attachedFiles: this.document.attached_files || [],
      },
    });
  }

  async exchangeFases() {
    const response = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Intercambiar fases',
          text: '¿Seguro que quieres intercambiar las fases? Las SS pasarán a ser SC y viceversa.',
        },
      })
      .afterClosed()
      .toPromise();

    if (response) {
      const updatedData = this.dataSource.map((row) => {
        let newFase;
        if (row.FASE === 'SC') {
          newFase = 'SS';
        } else if (row.FASE === 'SS') {
          newFase = 'SC';
        } else {
          newFase = row.FASE;
        }
        const newRow = { ...row, FASE: newFase };
        return newRow;
      });
      this.dataSource = updatedData;
      this.table.renderRows();
    }
  }

  async editRevision(revision) {
    try {
      const response = await this.dialog
        .open(EditRevisionDialogComponent, {
          data: {
            revision: revision,
          },
        })
        .afterClosed()
        .toPromise();

      if (response && response.revision) {
        await this.inserDocumentsService.updateRevision(response.revision);
      }

      await this.getDocument();
    } catch (error) {
      this._snackbar.open('Error al actualizar la revisión', null, {
        duration: 3000,
      });
    }
  }
}
