import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class DownloadDocumentService {

  constructor() { }

  public downloadAsPDF(document) {
    const doc: any = new jsPDF();

    autoTable(doc, {
      head: [[`SURTEL - LISTADO DE INSERCION     - ${new Date(document.created_at).toLocaleString()}`]],
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
        ['MODULO: PLACA LED MODULE', ''],
        ['CODIGO: BG_LED MODULE', ''],
        ['MODULO: LED MODULE', 'CLIENTE: ISYS']
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
        ['LISTA DE PIEZAS: ISYS LED MODULE', 'EDICION: VER HL'],
        ['PLANO SITUACION: RR-LED-MODUL_V1-7-0_ASSEMBLY', 'EDICION: VER HL'],
        ['PLANO ELECTRICO:', 'EDICION:']
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
        ['SMD COMP.: I25.LEDSC', 'SMD SOLD.: I25.LEDSS', 'TRADIC.: '],
      ],
      showHead: false,
      startY: finalY,
    });

    autoTable(doc, {
      head: [['', '', '']],
      body: [
        ['Nº DE COMPONENTES > TRAD: 1', 'SMD/S: 144', 'SMD/C: 192'],
      ],
      showHead: false
    });

    autoTable(doc, {
      head: [['']],
      body: [
        ['DATOS DEL CIRC.IMPR.: PANEL FR4 5X'],
        ['SERIGRAFIA PASTA: UC.3829,3854'],
        ['SOLDADURA REFLUJO: LEDMODUL'],
        ['CURADO ADHESIVO: NO APLICABLE'],
        ['SOLDADURA OLA: NO APLICABLE'],
        ['PREFORMADO, MAX. LONGITUD DE TERMINALES CARA SOLDADURA: N.A.']
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
        ['SURTEL:   VER PLAN DE CALIDAD'],
        ['CLIENTE:'],
      ],
      showHead: false,
      startY: finalY,
    });

    autoTable(doc, {
      head: [['', '']],
      body: [
        ['CODIGO DE ESTE DOCUMENTO:', 'I25.LED_MOD-LI'],
        ['TITULO DE ESTE DOCUMENTO:', 'LISTADO INSERCION PLACA ISYS LED MODULE'],
      ],
      showHead: false
    });
    autoTable(doc, {
      head: [['EDICION', 'MODIFICACION', 'FECHA', 'NOMBRE']],
      body: [
        ['54', 'VER LINEA 954', '21/09/20', 'MJ'],
        ['54', 'VER LINEA 954', '21/09/20', 'MJ'],
        ['54', 'VER LINEA 954', '21/09/20', 'MJ'],
        ['54', 'VER LINEA 954', '21/09/20', 'MJ'],
      ],
    });

    finalY = doc.lastAutoTable.finalY;

    doc.setFontSize(10)
    var splitText = doc.splitTextToSize('ATENCION: La información de este documento debe complementarse con la contenida en la correspondiente Hoja de Lanzamiento (HL)', 180);
    doc.text(splitText, 16, finalY + 2)

    doc.addPage();

    autoTable(doc, {
      head: [['C.TOTAL', 'CODIGO', 'FASE', 'DENOMINACION', 'COMENTARIOS']],
      body: this.get_table_body(document.content)
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
  }

  private get_table_body(content) {
    return content.map(row => {
      const result = [];
      result.push(row['C.TOTAL']);
      result.push(row['CODIGO']);
      result.push(row['FASE']);
      result.push(row['DENOMINACION']);
      result.push(row['COMENTARIOS'] || '');
      return result
    })
  }
}
