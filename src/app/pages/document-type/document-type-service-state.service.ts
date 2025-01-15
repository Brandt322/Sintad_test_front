import { Injectable } from '@angular/core';
import { DocumentsRequest, DocumentsResponse } from '@interfaces/documents';
import { DocumentTypeServiceService } from '@services/document-type-service.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeStateServiceService {
  private documentsSubject: BehaviorSubject<DocumentsResponse[]> = new BehaviorSubject<DocumentsResponse[]>([]);
  documents$: Observable<DocumentsResponse[]> = this.documentsSubject.asObservable();


  constructor(private documentTypeService: DocumentTypeServiceService) {}

  loadDocuments(): void {
    this.documentTypeService.getAllDocuments().subscribe((documents: DocumentsResponse[]) => {
      this.documentsSubject.next(documents);
    });
  }

  addDocument(documentrequest: DocumentsResponse): void{
    const document = this.documentsSubject.getValue();
    document.unshift(documentrequest);
    this.documentsSubject.next(document);
  }

  updateDocument(documentrequest: DocumentsRequest, id: number): void{
    const document = this.documentsSubject.getValue();
    const index = document.findIndex((doc) => doc.id === id);
    if (index !== -1) {
      document[index] = {
        ...document[index],
        ...documentrequest,
      };
      this.documentsSubject.next(document);
    }
  }

  deleteDocument(documentId: number): void{
    const document = this.documentsSubject.getValue();
    const updatedDocument = document.filter((doc) => doc.id !== documentId);
    this.documentsSubject.next(updatedDocument);
  }
}
