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
import { SelectInputComponent } from '../../form-inputs/select-input/select-input.component';
import { FormErrorComponent } from '../../form-inputs/form-error/form-error.component';
import { DocumentTypeBasicResponse } from '@interfaces/documents';
import { TaxpayerBasicListResponse } from '@interfaces/taxpayer';
import { DocumentTypeServiceService } from '@services/document-type-service.service';
import { TaxpayerTypeServiceService } from '@services/taxpayer-type-service.service';
import { LoaderService } from '@core/loader/loader.service';
import { EntityServiceService } from '@services/entity-service.service';
import { TextInputComponent } from '../../form-inputs/text-input/text-input.component';
import { EntityBasicResponse, EntityDetailsRequest } from '@interfaces/entity';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-modal-entity-registry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectInputComponent,
    FormErrorComponent,
    TextInputComponent,
  ],
  templateUrl: './modal-entity-registry.component.html',
  styleUrl: './modal-entity-registry.component.css',
  animations: [
      trigger('modalAnimation', [
        state('void', style({
          opacity: 0,
          transform: 'scale(0.95)'
        })),
        state('*', style({
          opacity: 1,
          transform: 'scale(1)'
        })),
        transition('void <=> *', [
          animate('200ms ease-in-out')
        ])
      ]),
      trigger('backgroundAnimation', [
        state('void', style({
          opacity: 0
        })),
        state('*', style({
          opacity: 1
        })),
        transition('void <=> *', [
          animate('200ms ease-in-out')
        ])
      ]),
      trigger('fadeInOut', [
        transition(':enter', [   // :enter es alias de 'void => *'
          style({ opacity: 0 }),
          animate('0.2s ease-out', style({ opacity: 1 }))
        ]),
        transition(':leave', [   // :leave es alias de '* => void'
          animate('0.2s ease-in', style({ opacity: 0 }))
        ])
      ])
    ]
})
export class ModalEntityRegistryComponent implements OnInit {
  isModalOpenOnCreateData: boolean = false;
  entityForm!: FormGroup;
  filterDocumentList: DocumentTypeBasicResponse[] = [];
  filterTaxpayerList: TaxpayerBasicListResponse[] = [];
  @Output() entityCreate = new EventEmitter<EntityBasicResponse>();

  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private loader: LoaderService,
    private entityService: EntityServiceService,
    private documentService: DocumentTypeServiceService,
    private taxpayerService: TaxpayerTypeServiceService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  onCreateData() {
    if(this.entityForm.valid){
      const {
        documentNumber,
        companyName,
        tradeName,
        address,
        cellphone,
        documentTypeId,
        taxpayerTypeId,
      } = this.entityForm.getRawValue();


      let taxpayerId: number | null = null;
      if (taxpayerTypeId) {
        taxpayerId = Number(taxpayerTypeId);
      } else {
        taxpayerId = null;
      }

      const entityRequest: EntityDetailsRequest = {
        documentNumber,
        companyName,
        tradeName,
        address,
        cellphone,
        documentTypeId,
        taxpayerTypeId: taxpayerId,
        state: true,
      };

      console.log(entityRequest);
      this.entityService.saveEntity(entityRequest).subscribe({
        next: (savedEntity) => {
          this.toastService.show('success', 'Entidad creada correctamente');
          this.entityCreate.emit(savedEntity);
          this.closeModalService();
        },
        error: (error) => {
          this.toastService.show('error', error.message);
        },
      });
    } else {
      this.entityForm.markAllAsTouched();
    }
  }

  buildForm() {
    this.entityForm = this.formBuilder.group({
      documentNumber: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      tradeName: [''],
      address: [''],
      cellphone: [''],
      documentTypeId: [
        null,
        [Validators.required],
      ],
      taxpayerTypeId: [null],
    });
  }

  onSelectOption(name: string | null, title: string) {
    const keyControl = this.entityForm.get(title);
    if (keyControl) {
      keyControl.setValue(Number(name));
      keyControl.markAsTouched();
      keyControl.updateValueAndValidity();
      if (name !== null) {
        // console.log(keyControl);
      }
    }
  }

  openModalService() {
    this.loader.showLoader();
    this.documentService
      .getDocumentList()
      .subscribe((documents: DocumentTypeBasicResponse[]) => {
        this.filterDocumentList = documents;
        this.checkIfDataLoaded();
      });

    this.taxpayerService
      .getTaxpayerList()
      .subscribe((taxpayers: TaxpayerBasicListResponse[]) => {
        // this.entityForm.reset();
        this.filterTaxpayerList = taxpayers;
        this.checkIfDataLoaded();
      });
  }

  checkIfDataLoaded() {
    if (this.filterDocumentList && this.filterTaxpayerList) {
      this.isModalOpenOnCreateData = true;
      this.loader.hideLoader();
    }
  }

  closeModalService() {
    this.entityForm.reset();
    this.isModalOpenOnCreateData = false;
  }
}
