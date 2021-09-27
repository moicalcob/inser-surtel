import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IngresDocumentsService } from './ingres-documents.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DownloadDocumentService {

  constructor(private documentsService: IngresDocumentsService) { }

  public async downloadAsPDF(document_id) {
    try {
      const document: any = await this.documentsService.getIngresDocumentById(document_id);
      const doc: any = new jsPDF();
      let formattedDate = (moment(document.created_at)).format('HH:mm DD/MM/YYYY')

      autoTable(doc, {
        head: [[`SURTEL - LISTADO DE INSERCION    -    ${formattedDate}`]],
        headStyles: {
          halign: 'center'
        },
        margin: {
          top: 5
        },
        theme: 'plain'
      });

      let finalY = doc.lastAutoTable.finalY;

      autoTable(doc, {
        head: [['', '']],
        body: [
          [`MODULO: ${document?.description?.denominacion}`, ''],
          [`CODIGO: ${document?.description?.codigo}`, ''],
          [`PRODUCTO: POR APLICAR`, `CLIENTE: ${document?.description?.cliente}`]
        ],
        headStyles: {
          halign: 'center'
        },
        showHead: false,
        startY: finalY,
        theme: 'plain'
      });

      autoTable(doc, {
        head: [['DOCUMENTACIÓN APLICABLE']],
        body: [],
        headStyles: {
          halign: 'center'
        }
      });

      finalY = doc.lastAutoTable.finalY;

      autoTable(doc, {
        head: [['', '']],
        body: [
          [`LISTA DE PIEZAS: ${document?.description?.cod_modulo}`, `EDICION: POR APLICAR`],
          [`PLANO SITUACION: ${document?.description?.plano_situacion}`, `EDICION: POR APLICAR`],
          [`PLANO ELECTRICO: ${document?.description?.plano_electrico}`, `EDICION: POR APLICAR`]
        ],
        showHead: false,
        startY: finalY,
      });


      autoTable(doc, {
        head: [['PROGRAMAS DE INSERTADO SMD Y TRADICIONAL']],
        body: [],
        headStyles: {
          halign: 'center'
        },
      });

      finalY = doc.lastAutoTable.finalY;

      autoTable(doc, {
        head: [['', '', '']],
        body: [
          [`SMD COMP.: POR APLICAR`, `SMD SOLD.: POR APLICAR`, `TRADIC.: POR APLICAR`],
        ],
        showHead: false,
        startY: finalY,
      });

      autoTable(doc, {
        head: [['', '', '']],
        body: [
          [`Nº DE COMPONENTES > TRAD: POR APLICAR`, `SMD/S: POR APLICAR`, `SMD/C: POR APLICAR`],
        ],
        showHead: false
      });

      autoTable(doc, {
        head: [['']],
        body: [
          [`DATOS DEL CIRC.IMPR.: ${document?.description?.datos_pcb}`],
          [`SERIGRAFIA PASTA: ${document?.description.serigrafia}`],
          [`SOLDADURA REFLUJO: ${document?.description.reflujo}`],
          [`CURADO ADHESIVO: ${document?.description.adhesivo}`],
          [`SOLDADURA OLA: ${document?.description.ola}`],
          [`PREFORMADO, MAX. LONGITUD DE TERMINALES CARA SOLDADURA: POR APLICAR`]
        ],
        showHead: false
      });

      autoTable(doc, {
        head: [['NORMATIVA GENERAL APLICABLE AL PRODUCTO (WORKMANSHIP)']],
        body: [],
        headStyles: {
          halign: 'center',
        },
      });

      finalY = doc.lastAutoTable.finalY;

      autoTable(doc, {
        head: [['']],
        body: [
          [`SURTEL:   ${document?.description?.norma_surtel}`],
          [`CLIENTE:    ${document?.description?.norma_cliente}`],
        ],
        showHead: false,
        startY: finalY,
      });

      autoTable(doc, {
        head: [['', '']],
        body: [
          ['CODIGO DE ESTE DOCUMENTO:', 'POR APLICAR'],
          ['TITULO DE ESTE DOCUMENTO:', document.name],
        ],
        showHead: false
      });
      autoTable(doc, {
        head: [['EDICION', 'MODIFICACION', 'FECHA', 'NOMBRE']],
        body: this.getRevisionsBody(document.revisions)
      });

      finalY = doc.lastAutoTable.finalY;

      doc.setFontSize(10)
      var splitText = doc.splitTextToSize('ATENCION: La información de este documento debe complementarse con la contenida en la correspondiente Hoja de Lanzamiento (HL)', 180);
      doc.text(splitText, 16, finalY + 4)

      doc.addPage();

      autoTable(doc, {
        head: [['', 'C.TOTAL', 'CODIGO', 'FASE', 'DENOMINACION', 'COMENTARIOS']],
        body: this.getTableBody(document.content)
      });

      const pages = doc.getNumberOfPages();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);

      for (let j = 1; j < pages + 1; j++) {
        let horizontalPos = pageWidth / 2;
        let verticalPos = pageHeight - 10;
        doc.setPage(j);
        doc.text(`${j} of ${pages}`, horizontalPos, verticalPos, {
          align: 'center'
        });
      }

      doc.save('tableToPdf.pdf');
    } catch (error) {
      console.error(error)
    }
  }

  private getTableBody(content) {
    return content.map((row, index) => {
      const result = [];
      result.push(index);
      result.push(row['CANTIDAD'] + ' ' + row['UNIDAD']);
      result.push(row['CODIGO']);
      result.push(row['FASE']);
      result.push(row['REFERENCIA']);
      result.push(row['DENOMINACION']);
      result.push(row['COMENTARIOS'] || '');
      return result
    })
  }

  private getRevisionsBody(revisions) {
    return revisions.map((row, index) => {
      let formattedDate = (moment(row['updated_at'])).format('HH:mm DD/MM/YYYY')
      const result = [];
      result.push(revisions.length - index);
      result.push(row['reason']);
      result.push(formattedDate);
      result.push(row['user']['name']);
      return result
    })
  }
}
