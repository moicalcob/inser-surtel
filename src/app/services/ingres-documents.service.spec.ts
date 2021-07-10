import { TestBed } from '@angular/core/testing';

import { IngresDocumentsService } from './ingres-documents.service';

describe('IngresDocumentsService', () => {
  let service: IngresDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngresDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
