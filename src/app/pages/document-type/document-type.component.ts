import { Component, OnInit } from '@angular/core';
import { DocumentsRequest, DocumentsResponse } from '@interfaces/documents';
import { DocumentTypeStateServiceService } from './document-type-service-state.service';
import { CommonModule } from '@angular/common';
import { ModalDocumentTypeRegistryComponent } from '../../shared/components/form-modals/modal-document-type-registry/modal-document-type-registry.component';
import { DocumentTypeServiceService } from '@services/document-type-service.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TextInputComponent } from '../../shared/components/form-inputs/text-input/text-input.component';
import { FormErrorComponent } from '../../shared/components/form-inputs/form-error/form-error.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ToastService } from '@core/toast/toast.service';

@Component({
  selector: 'app-document-type',
  standalone: true,
  imports: [
    CommonModule,
    ModalDocumentTypeRegistryComponent,
    FormsModule,
    ReactiveFormsModule,
    TextInputComponent,
    FormErrorComponent,
  ],
  templateUrl: './document-type.component.html',
  styleUrl: './document-type.component.css',
  animations: [
    trigger('modalAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(0.95)',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'scale(1)',
        })
      ),
      transition('void <=> *', [animate('200ms ease-in-out')]),
    ]),
    trigger('backgroundAnimation', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
        })
      ),
      transition('void <=> *', [animate('200ms ease-in-out')]),
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        // :enter es alias de 'void => *'
        style({ opacity: 0 }),
        animate('0.2s ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        // :leave es alias de '* => void'
        animate('0.2s ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class DocumentTypeComponent implements OnInit {
  documents: DocumentsResponse[] = [];

  isModalOpenOnUpdateData = false;
  confirmDeleteModal = false;
  selectedDocument!: DocumentsResponse;

  idToDelete!: number;

  documentToUpdateForm!: FormGroup;

  constructor(
    private documentsState: DocumentTypeStateServiceService,
    private documentService: DocumentTypeServiceService,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
    this.documentsState.documents$.subscribe((documents) => {
      this.documents = documents;
    });
  }

  loadDocuments(): void {
    this.documentsState.loadDocuments();
  }

  onCreateDocument(document: DocumentsResponse): void {
    this.documentsState.addDocument(document);
    this.loadDocuments();
  }

  onUpdateDocument(): void {
    if (this.documentToUpdateForm.invalid) {
      this.documentToUpdateForm.markAllAsTouched();
      return;
    }

    const documentUpdated: DocumentsRequest = {
      ...this.documentToUpdateForm.value,
    };

    // console.log(documentUpdated);
    this.documentService
      .updatedocument(this.selectedDocument.id, documentUpdated)
      .subscribe({
        next: () => {
          this.toastService.show(
            'success',
            'Documento actualizado correctamente'
          );
          this.documentsState.updateDocument(
            documentUpdated,
            this.selectedDocument.id
          );
          this.loadDocuments();
          this.closeModalToUpdateData();
        },
        error: (error) => {
          this.toastService.show('error', error.message);
        },
      });
  }

  removeDocument(): void {
    this.documentService.deleteDocument(this.idToDelete).subscribe({
      next: () => {
        this.toastService.show('success', 'Documento eliminado correctamente');
        this.documentsState.deleteDocument(this.idToDelete);
        this.loadDocuments();
        this.confirmDeleteModal = false;
      },
      error: (error) => {
        this.toastService.show('error', error.message);
      },
    });
  }

  selectedServiceData(document: DocumentsResponse): void {
    // this.requestOptions();
    this.documentService
      .getDocumentById(document.id)
      .subscribe((selectedDocument: DocumentsResponse) => {
        this.selectedDocument = selectedDocument;
        this.initDocumentForm(selectedDocument);
        // console.log(this.selectedDocument);
        this.isModalOpenOnUpdateData = true;
      });
  }

  initDocumentForm(document: DocumentsResponse): void {
    this.documentToUpdateForm = this.formBuilder.group({
      code: document.code,
      name: document.name,
      description: document.description,
      state: document.state,
    });
  }

  closeModalToUpdateData(): void {
    this.isModalOpenOnUpdateData = false;
    this.selectedDocument = {} as DocumentsResponse;
    this.documentToUpdateForm.reset();
  }

  openModalToDelete(id: number) {
    this.idToDelete = id;
    this.confirmDeleteModal = true;
  }

  closeConfirmDeleteModal(): void {
    this.confirmDeleteModal = false;
  }
}
