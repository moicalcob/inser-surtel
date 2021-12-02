import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RowCopyService {
  constructor() {}

  storeCopiedRow(row: any): void {
    localStorage.setItem('copiedRow', JSON.stringify(row));
  }

  getCopiedRow(): any {
    return JSON.parse(localStorage.getItem('copiedRow'));
  }

  rowAvailableToPaste(): boolean {
    return localStorage.getItem('copiedRow') !== null;
  }
}
