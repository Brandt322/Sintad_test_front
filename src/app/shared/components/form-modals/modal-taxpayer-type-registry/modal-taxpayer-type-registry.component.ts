import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '@core/toast/toast.service';
import { TaxpayerRequest, TaxpayerTypeBasicResponse } from '@interfaces/taxpayer';
import { TaxpayerTypeServiceService } from '@services/taxpayer-type-service.service';
import { FormErrorComponent } from '@shared/components/form-inputs/form-error/form-error.component';
import { TextInputComponent } from '@shared/components/form-inputs/text-input/text-input.component';
import { Modal } from 'flowbite';

@Component({
  selector: 'app-modal-taxpayer-type-registry',
  standalone: true,
  imports: [
    TextInputComponent,
    FormErrorComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './modal-taxpayer-type-registry.component.html',
})
export class ModalTaxpayerTypeRegistryComponent implements OnInit {
  taxpayerForm!: FormGroup;
  @Output() taxpayerCreate = new EventEmitter<TaxpayerTypeBasicResponse>();

  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private taxpayerService: TaxpayerTypeServiceService
  ) {}

  ngOnInit() {
    this.buildTaxpayerForm();
  }

  buildTaxpayerForm() {
    this.taxpayerForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    });
  }

  onSubmitService() {
    // console.log(this.taxpayerForm.getRawValue());
    if (this.taxpayerForm.valid) {
      let { name } = this.taxpayerForm.getRawValue();

      const taxpayerRequest: TaxpayerRequest = {
        name,
        state: true,
      };

      this.taxpayerService.saveTaxpayerType(taxpayerRequest).subscribe({
        next: (savedTaxpayer) => {
        //   console.log(savedTaxpayer);
          this.toastService.show(
            'success',
            'Tipo de contribuyente creado correctamente'
          );
          this.taxpayerCreate.emit(savedTaxpayer);
          this.closeModalService();
        },
        error: (error) => {
          this.toastService.show('error', error.message);
        },
      });
    } else {
        this.taxpayerForm.markAllAsTouched();
    }
  }

  openModalService() {
    const serviceModalElement = document.getElementById(
      'create-taxpayer-modal'
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
    const modalElement = document.getElementById('create-taxpayer-modal');
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
    this.taxpayerForm.reset();
  }
}
