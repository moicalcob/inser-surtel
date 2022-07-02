import autoTable, { UserOptions } from 'jspdf-autotable';

export function addInserTableBody(doc, document) {
  let headerShown = {
    SC: 'pending',
    SS: 'pending',
    IN: 'pending',
    PM: 'pending',
  };
  document.content.forEach((rowContent, index) => {
    if (
      rowContent.type === 'component' &&
      headerShown[rowContent?.FASE] === 'pending'
    ) {
      headerShown[rowContent?.FASE] = 'show';
    } else if (
      rowContent.type === 'component' &&
      headerShown[rowContent?.FASE] === 'show'
    ) {
      headerShown[rowContent?.FASE] = 'hide';
    }
    addContentRow(doc, rowContent, index, headerShown);
  });
}

function addContentRow(doc, row, index, headerShown) {
  let finalY = doc.lastAutoTable.finalY;

  const rowPdf: UserOptions = {
    head: [['', 'C.TOTAL', 'FASE', 'DENOMINACION', 'REFERENCIA', 'MSD']],
    columnStyles: getColumnStyles(index),
    body: [getRowBody(row, index)],
    margin: {
      top: 30,
    },
    pageBreak: 'avoid',
  };

  rowPdf.showHead =
    row.type === 'component' && headerShown[row.FASE] === 'show' ? true : false;

  if (index !== 0) {
    rowPdf.startY = finalY;
  }

  if (row.type === 'image') {
    rowPdf.didDrawCell = (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const safeUrl = row.imageBase64.changingThisBreaksApplicationSecurity;
        var base64Img = safeUrl.replace(
          'data:application/octet-stream;base64',
          'data:image/jpeg;base64',
        );
        doc.addImage(
          base64Img,
          'JPEG',
          data.cell.x + 2,
          data.cell.y + 2,
          120,
          90,
        );
      }
    };
    rowPdf.styles = {
      minCellHeight: 94,
    };
    autoTable(doc, rowPdf);
  } else {
    autoTable(doc, rowPdf);
  }

  finalY = doc.lastAutoTable.finalY;

  if (row.type === 'component') {
    autoTable(doc, {
      showHead: false,
      head: [['', '']],
      body: [[' ', row.CODIGO || '']],
      columnStyles: {
        0: {
          cellWidth: 12,
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        1: {
          cellWidth: 170,
          fillColor: index % 2 === 0 ? [255, 255, 255] : [242, 242, 242],
          fontStyle: 'bold',
        },
      },
      startY: finalY,
    });
    finalY = doc.lastAutoTable.finalY;
    autoTable(doc, {
      showHead: false,
      head: [['', '']],
      body: [[' ', row.COMENTARIOS ? 'Comentarios: ' + row.COMENTARIOS : '']],
      columnStyles: {
        0: {
          cellWidth: 12,
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        1: {
          cellWidth: 170,
          fillColor: index % 2 === 0 ? [255, 255, 255] : [242, 242, 242],
        },
      },
      startY: finalY,
    });
  }

  doc.setLineWidth(1);
  doc.setDrawColor(0, 0, 0);
  doc.line(
    14,
    doc.lastAutoTable.finalY,
    doc.internal.pageSize.getWidth() - 14,
    doc.lastAutoTable.finalY,
  );
}

function getRowBody(row, index) {
  const result: any = [];
  result.push(index);
  if (row.type === 'component') {
    result.push(
      row.CANTIDAD && row.UNIDAD ? row.CANTIDAD + ' ' + row.UNIDAD : '',
    );
    result.push(row.FASE || '');
    result.push(row.DENOMINACION || '');
    result.push(row.REFERENCIA || '');
    result.push(row.MSD || '');
    result.push(row.CODIGO || '');
  } else {
    result.push({
      content: row.CONTENIDO,
      colSpan: 5,
      styles: {
        halign: 'left',
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
    });
  }

  return result;
}

function getColumnStyles(index?): any {
  return {
    0: {
      cellWidth: 12,
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    1: {
      cellWidth: 20,
      fillColor: index % 2 === 0 ? [255, 255, 255] : [242, 242, 242],
    },
    2: {
      cellWidth: 15,
      fillColor: index % 2 === 0 ? [255, 255, 255] : [242, 242, 242],
    },
    3: {
      cellWidth: 60,
      fillColor: index % 2 === 0 ? [255, 255, 255] : [242, 242, 242],
    },
    4: {
      cellWidth: 60,
      fillColor: index % 2 === 0 ? [255, 255, 255] : [242, 242, 242],
    },
    5: {
      cellWidth: 15,
      fillColor: index % 2 === 0 ? [255, 255, 255] : [242, 242, 242],
    },
  };
}
