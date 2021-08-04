import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IngresDocumentsService } from 'src/app/services/ingres-documents.service';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.scss']
})
export class EditDocumentComponent {

  loaded = false;

  document;

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
    private route: ActivatedRoute
  ) {
    this.getDocument();
  }

  async getDocument() {
    try {
      const documentId = this.route.snapshot.params['document_id'];
      this.document = await this.ingresDocumentsService.getIngresDocumentById(documentId);
      this.initDocumentForm();
    } catch (error) {
      console.error(error);
    }
  }

  initDocumentForm() {
    this.descriptionFormGroup.setValue({
      cod_modulo: this.document.description.cod_modulo || '',
      plano_situacion: this.document.description.plano_situacion || '',
      plano_electrico: this.document.description.plano_electrico || '',
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
      codigo: this.document.description.codigo || ''
    })

    this.loaded = true;
  }

}