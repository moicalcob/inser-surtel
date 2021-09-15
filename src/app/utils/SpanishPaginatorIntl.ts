import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class SpanishPaginatorIntl implements MatPaginatorIntl {
    changes = new Subject<void>();

    firstPageLabel = `Primera página`;
    itemsPerPageLabel = `Items por página:`;
    lastPageLabel = `Última página`;

    nextPageLabel = 'Siguiente página';
    previousPageLabel = 'Página anterior';

    getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0) {
            return `Página 1 de 1`;
        }
        const amountPages = Math.ceil(length / pageSize);
        return `Página ${page + 1} de ${amountPages}`;
    }
}
