import { TestBed } from '@angular/core/testing';

import { DownloadDocumentService } from './download-document.service';

describe('DownloadDocumentService', () => {
  let service: DownloadDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
