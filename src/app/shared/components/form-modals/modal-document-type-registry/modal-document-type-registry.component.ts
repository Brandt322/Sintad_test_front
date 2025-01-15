import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Modal } from 'flowbite';
import { TextInputComponent } from "../../form-inputs/text-input/text-input.component";
import { FormErrorComponent } from "../../form-inputs/form-error/form-error.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentTypeServiceService } from '../../../../services/document-type-service.service';
import { DocumentsRequest, DocumentsResponse } from '@interfaces/documents';
import { ToastService } from '@core/toast/toast.service';

@Component({
  selector: 'app-modal-document-type-registry',
  standalone: true,
  imports: [TextInputComponent, FormErrorComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modal-document-type-registry.component.html',
  styleUrl: './modal-document-type-registry.component.css'
})
export class ModalDocumentTypeRegistryComponent implements OnInit{
  documentForm!: FormGroup;
  @Output() documentCreate = new EventEmitter<DocumentsResponse>();

  constructor(
    private formBuilder: FormBuilder,
    private documentService :DocumentTypeServiceService,
    private toastService: ToastService
  ){}

  ngOnInit() {
    this.buildDocumentForm();
  }

  buildDocumentForm() {
    this.documentForm = this.formBuilder.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['']
    })
  }

  onSubmitService() {
    // console.log(this.documentForm.getRawValue());
    if (this.documentForm.valid) {
      let {
        code, name, description
      } = this.documentForm.getRawValue();
      
      const documentRequest: DocumentsRequest = {
        code,
        name,
        description,
        state: true
      }

      this.documentService.saveDocument(documentRequest).subscribe({
        next: (savedDocument) => {
          console.log(savedDocument);
          this.toastService.show('success', 'Documento creado correctamente');
          this.documentCreate.emit(savedDocument);
          this.closeModalService();
        },
        error: (error) => {
          this.toastService.show('error', error.message);
        }
      });
      
    } else {
      this.documentForm.markAllAsTouched();
    }
  }

  openModalService() {
    const serviceModalElement = document.getElementById(
      'create-documents-modal'
    );
    if (serviceModalElement) {
      const documentModal = new Modal(serviceModalElement);
      documentModal._options.backdrop = 'static';
      documentModal._options.backdropClasses =
        'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40 transition ease-in-out delay-200';
      serviceModalElement.classList.add(
        'transition',
        'ease-out',
        'duration-200',
        'opacity-0'
      );
      setTimeout(() => {
        serviceModalElement.classList.remove('opacity-0');
        serviceModalElement.classList.add('opacity-100');
        serviceModalElement.setAttribute('aria-hidden', 'false');
        serviceModalElement.removeAttribute('inert');
      }, 0);

      documentModal.show();
    }
  }

  closeModalService() {
    const modalElement = document.getElementById('create-documents-modal');
    if (modalElement) {
      modalElement.classList.add(
        'transition',
        'ease-in',
        'duration-200',
        'opacity-100'
      );
      modalElement.classList.remove('opacity-100');
      modalElement.classList.add('opacity-0');
      setTimeout(() => {
        const modal = new Modal(modalElement);
        modal.hide();
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.setAttribute('inert', '');
        this.resetForm();
      }, 200);
    }
  }

  resetForm() {
    this.documentForm.reset();
  }
}
