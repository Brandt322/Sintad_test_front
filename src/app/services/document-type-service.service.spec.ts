import { TestBed } from '@angular/core/testing';

import { DocumentTypeServiceService } from './document-type-service.service';

describe('DocumentTypeServiceService', () => {
  let service: DocumentTypeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentTypeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
