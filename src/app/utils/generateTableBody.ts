import autoTable from 'jspdf-autotable';

export function addInserTableBody(doc, document) {
  let headerShown = 'pending';
  document.content.forEach((rowContent, index) => {
    if (headerShown === 'pending' && rowContent.type === 'component') {
      headerShown = 'show';
    } else if (headerShown === 'show') {
      headerShown = 'hide';
    }
    addContentRow(doc, rowContent, index, headerShown);
  });
}

function addContentRow(doc, row, index, headerShown) {
  let finalY = doc.lastAutoTable.finalY;

  const rowPdf: any = {
    head: [
      [
        '',
        'C.TOTAL',
        'FASE',
        'REFERENCIA',
        'DENOMINACION',
        'COMENTARIOS',
        'MSD',
      ],
    ],
    columnStyles: getColumnStyles(index),
    body: [getRowBody(row, index)],
  };

  rowPdf.showHead = headerShown === 'show' ? true : false;

  if (index !== 0) {
    rowPdf.startY = finalY;
  }

  autoTable(doc, rowPdf);

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
  }
}

function getRowBody(row, index) {
  const result: any = [];
  result.push(index);
  if (row.type === 'component') {
    result.push(
      row.CANTIDAD && row.UNIDAD ? row.CANTIDAD + ' ' + row.UNIDAD : '',
    );
    result.push(row.FASE || '');
    result.push(row.REFERENCIA || '');
    result.push(row.DENOMINACION || '');
    result.push(row.COMENTARIOS || '');
    result.push(row.MSD || '');
    result.push(row.CODIGO || '');
  } else {
    result.push({
      content: row.CONTENIDO,
      colSpan: 5,
      styles: {
        halign: 'left',
        textColor: [0, 0, 0],
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
      cellWidth: 20,
      fillColor: index % 2 === 0 ? [255, 255, 255] : [242, 242, 242],
    },
    3: {
      cellWidth: 40,
      fillColor: index % 2 === 0 ? [255, 255, 255] : [242, 242, 242],
    },
    4: {
      cellWidth: 40,
      fillColor: index % 2 === 0 ? [255, 255, 255] : [242, 242, 242],
    },
    5: {
      cellWidth: 35,
      fillColor: index % 2 === 0 ? [255, 255, 255] : [242, 242, 242],
    },
    6: {
      cellWidth: 15,
      fillColor: index % 2 === 0 ? [255, 255, 255] : [242, 242, 242],
    },
  };
}
