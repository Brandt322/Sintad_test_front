import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastService } from '@core/toast/toast.service';
import { FormErrorComponent } from '@shared/components/form-inputs/form-error/form-error.component';
import { TextInputComponent } from '@shared/components/form-inputs/text-input/text-input.component';
import { TaxpayerTypeStateService } from './taxpayer-type-state.service';
import { TaxpayerTypeServiceService } from '@services/taxpayer-type-service.service';
import { TaxpayerResponse } from '@interfaces/taxpayer';
import { ModalTaxpayerTypeRegistryComponent } from "../../shared/components/form-modals/modal-taxpayer-type-registry/modal-taxpayer-type-registry.component";

@Component({
  selector: 'app-taxpayer-type',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextInputComponent,
    FormErrorComponent,
    ModalTaxpayerTypeRegistryComponent
],
  templateUrl: './taxpayer-type.component.html',
  styleUrl: './taxpayer-type.component.css',
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
export class TaxpayerTypeComponent implements OnInit {
  taxpayers: TaxpayerResponse[] = [];
  isModalOpenOnUpdateData = false;
  confirmDeleteModal = false;
  idToDelete!: number;
  selectedTaxpayer!: TaxpayerResponse;

  taxpayerToUpdateForm!: FormGroup;

  constructor(
    private taxpayerService: TaxpayerTypeServiceService,
    private taxpayerState: TaxpayerTypeStateService,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTaxpayers();
    this.taxpayerState.taxpayer$.subscribe((taxpayers) => {
      this.taxpayers = taxpayers;
    });
  }

  loadTaxpayers(): void {
    this.taxpayerState.loadTaxpayerTypes();
  }

  onCreateTaxpayer(taxpayer: TaxpayerResponse): void {
    this.taxpayerState.addTaxpayerType(taxpayer);
    this.loadTaxpayers();
  }


  onUpdateTaxpayer(): void {
    if (this.taxpayerToUpdateForm.invalid) {
      this.taxpayerToUpdateForm.markAllAsTouched();
      return;
    }

    const taxpayerUpdated: TaxpayerResponse = {
      ...this.taxpayerToUpdateForm.value,
    };

    this.taxpayerService
      .updateTaxpayerType(this.selectedTaxpayer.id, taxpayerUpdated)
      .subscribe({
        next: () => {
          this.toastService.show(
            'success',
            'Tipo de contribuyente actualizado correctamente'
          );
          this.taxpayerState.updateTaxpayerType(
            taxpayerUpdated,
            this.selectedTaxpayer.id
          );
          this.loadTaxpayers();
          this.closeModalToUpdateData();
        },
        error: (error) => {
          this.toastService.show('error', error.message);
        },
      });
  }

  removeTaxpayer(): void {
    this.taxpayerService.deleteTaxpayerType(this.idToDelete).subscribe({
      next: () => {
        this.toastService.show(
          'success',
          'Tipo de contribuyente eliminado correctamente'
        );
        this.taxpayerState.deleteTaxpayerType(this.idToDelete);
        this.loadTaxpayers();
        this.confirmDeleteModal = false;
      },
      error: (error) => {
        this.toastService.show('error', error.message);
      },
    });
  }

  selectedServiceData(taxpayer: TaxpayerResponse): void {
    // this.requestOptions();
    this.taxpayerService
      .getTaxpayerTypeById(taxpayer.id)
      .subscribe((selectedTaxpayer: TaxpayerResponse) => {
        this.selectedTaxpayer = selectedTaxpayer;
        this.initTaxpayerForm(selectedTaxpayer);
        // console.log(this.selectedDocument);
        this.isModalOpenOnUpdateData = true;
      });
  }

  initTaxpayerForm(taxpayer: TaxpayerResponse): void {
    this.taxpayerToUpdateForm = this.formBuilder.group({
      name: [taxpayer.name],
      state: [taxpayer.state],
    });
  }

  closeModalToUpdateData(): void {
    this.isModalOpenOnUpdateData = false;
    this.selectedTaxpayer = {} as TaxpayerResponse;
    this.taxpayerToUpdateForm.reset();
  }

  openModalToDelete(id: number) {
    this.idToDelete = id;
    this.confirmDeleteModal = true;
  }

  closeConfirmDeleteModal(): void {
    this.confirmDeleteModal = false;
  }
}
