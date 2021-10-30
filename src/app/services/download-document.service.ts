import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InserDocumentsService } from './inser-documents.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DownloadDocumentService {

  constructor(private documentsService: InserDocumentsService) { }

  public async downloadAsPDF(document_id) {
    try {
      const document: any = await this.documentsService.getInserDocumentById(document_id);
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

      this.drawLine(doc, 15, doc.lastAutoTable.finalY, doc.internal.pageSize.getWidth() - 15, doc.lastAutoTable.finalY);

      autoTable(doc, {
        head: [['', '']],
        body: [
          [`MODULO: ${document?.description?.denominacion}`, ''],
          [`CODIGO: ${document?.description?.codigo}`, ''],
          [`PRODUCTO: ${document?.description?.producto}`, `CLIENTE: ${document?.description?.cliente}`]
        ],
        headStyles: {
          halign: 'center'
        },
        showHead: false,
        startY: finalY,
        theme: 'plain',
      });

      this.drawLine(doc, 15, finalY, 15, doc.lastAutoTable.finalY);
      this.drawLine(doc, doc.internal.pageSize.getWidth() - 15, finalY, doc.internal.pageSize.getWidth() - 15, doc.lastAutoTable.finalY);
      this.drawLine(doc, 15, doc.lastAutoTable.finalY, doc.internal.pageSize.getWidth() - 15, doc.lastAutoTable.finalY);

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
          [`PLANO SITUACION: ${document?.description?.plano_situacion}`, `EDICION: ${document?.description?.plano_situacion_edicion}`],
          [`PLANO ELECTRICO: ${document?.description?.plano_electrico}`, `EDICION: ${document?.description?.plano_electrico_edicion}`]
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
          [`SMD COMP.: ${document?.description?.smd_comp}`, `SMD SOLD.: ${document?.description?.smd_sold}`, `TRADIC.: ${document?.description?.tradic}`],
        ],
        showHead: false,
        startY: finalY,
      });

      autoTable(doc, {
        head: [['', '', '']],
        body: [
          [`Nº DE COMPONENTES > TRAD: ${document?.description.num_componentes}`, `SMD/S: ${document?.description?.smds}`, `SMD/C: ${document?.description?.num_componentes}`],
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
        head: [['', 'C.TOTAL', 'CODIGO', 'FASE', 'REFERENCIA', 'DENOMINACION', 'COMENTARIOS', 'MSD']],
        body: this.getTableBody(document.content),
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 35 },
          5: { cellWidth: 35 },
          6: { cellWidth: 30 },
          7: { cellWidth: 10 }
        }
      });

      const pages = doc.getNumberOfPages();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);

      for (let j = 1; j < pages + 1; j++) {
        let horizontalPos = pageWidth / 2;
        let verticalPos = pageHeight - 10;
        doc.setPage(j);
        doc.text(`${j} de ${pages}`, horizontalPos, verticalPos, {
          align: 'center'
        });
      }

      doc.save(`${document.name}.pdf`);
    } catch (error) {
      console.error(error)
    }
  }

  private getTableBody(content) {
    return content.map((row, index) => {
      let result: any = [];
      result.push(index);
      if (row['type'] === 'component') {
        result.push(row['CANTIDAD'] + ' ' + row['UNIDAD']);
        result.push(row['CODIGO']);
        result.push(row['FASE']);
        result.push(row['REFERENCIA']);
        result.push(row['DENOMINACION']);
        result.push(row['COMENTARIOS'] || '');
        result.push(row['MSD'] || '');
      } else {
        result.push({
          content: row['CONTENIDO'], colSpan: 6, styles: {
            halign: 'left',
            textColor: [0, 0, 0],
          }
        })
      }
      return result
    })
  }

  private getRevisionsBody(revisions) {
    return revisions.map((row, index) => {
      let formattedDate = (moment(row['updated_at'])).format('HH:mm DD/MM/YYYY')
      const result = [];
      result.push(revisions.length - index + 50);
      result.push(row['reason']);
      result.push(formattedDate);
      result.push(row['user']['name']);
      return result
    })
  }

  private drawLine(doc, x1, y1, x2, y2) {
    doc.setLineWidth(1);
    doc.setDrawColor(0, 0, 0);
    doc.line(x1, y1, x2, y2);

  }
}
