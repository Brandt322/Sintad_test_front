import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EntityStateService } from './entity-state.service';
import { EntityBasicResponse, EntityDetailsRequest, EntityDetailsRespone } from '@interfaces/entity';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DocumentTypeServiceService } from '@services/document-type-service.service';
import { DocumentTypeBasicResponse } from '@interfaces/documents';
import { TaxpayerBasicListResponse } from '@interfaces/taxpayer';
import { initDropdowns, initTooltips } from 'flowbite';
import { TaxpayerTypeServiceService } from '@services/taxpayer-type-service.service';
import { ToastService } from '@core/toast/toast.service';
import { LoaderService } from '@core/loader/loader.service';
import { EntityServiceService } from '@services/entity-service.service';
import { catchError, finalize, forkJoin, throwError } from 'rxjs';
import { SelectInputComponent } from "../../shared/components/form-inputs/select-input/select-input.component";
import { FormErrorComponent } from "../../shared/components/form-inputs/form-error/form-error.component";
import { TextInputComponent } from "../../shared/components/form-inputs/text-input/text-input.component";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ModalEntityRegistryComponent } from "../../shared/components/form-modals/modal-entity-registry/modal-entity-registry.component";

@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectInputComponent, FormErrorComponent, TextInputComponent, ModalEntityRegistryComponent],
  templateUrl: './entities.component.html',
  styleUrl: './entities.component.css',
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
export class EntitiesComponent implements OnInit {
  columnHeaders = [
    'Nº DOCUMENTO',
    'RAZON SOCIAL',
    'NOMBRE COMERCIAL',
    'TIPO DE DOCUMENTO',
    'TIPO DE CONTRIBUYENTE',
  ];

  page: number = 1;
  size: number = 5;
  totalElements: number = 0;
  totalPages: number = 0;
  maxVisiblePages: number = 10;
  state: string = '';
  documentType: string = '';
  taxpayerType: string = '';
  tempState: string = '';
  tempDocumentType: string = '';
  tempTaxpayerType: string = '';

  entities: EntityBasicResponse[] = [];
  filterDocumentList: DocumentTypeBasicResponse[] = [];
  filterTaxpayerList: TaxpayerBasicListResponse[] = [];

  documentList: DocumentTypeBasicResponse[] = [];
  taxpayerList: TaxpayerBasicListResponse[] = [];

  isModalOpenOnUpdateData: boolean = false;
  modalDelete: boolean = false;
  idToDelete: number = 0;

  selectedEntity!: EntityDetailsRespone;
  initialFormValuesOnUpdateData!: EntityDetailsRespone;

  entityForm!: FormGroup;

  constructor(
    private entityState: EntityStateService,
    private entityService: EntityServiceService,
    private documentService: DocumentTypeServiceService,
    private taxpayerService: TaxpayerTypeServiceService,
    private toastService: ToastService,
    private loader: LoaderService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadEntities();

    this.entityState
      .getServices()
      .subscribe((entities: EntityBasicResponse[]) => {
        this.entities = entities;
        setTimeout(() => {
          initDropdowns();
          initTooltips();
        }, 0);
      });

    this.entityState.getTotalElements().subscribe((totalElements: number) => {
      this.totalElements = totalElements;
    });

    this.entityState.getTotalPages().subscribe((totalPages: number) => {
      this.totalPages = totalPages;
    });

    this.documentService
      .getDocumentList()
      .subscribe((documents: DocumentTypeBasicResponse[]) => {
        this.filterDocumentList = documents;
      });

    this.taxpayerService
      .getTaxpayerList()
      .subscribe((taxpayers: TaxpayerBasicListResponse[]) => {
        this.filterTaxpayerList = taxpayers;
      });
  }

  loadEntities(): void {
    this.entityState.loadEntities(
      this.page,
      this.size,
      this.documentType === '' ? 0 : Number(this.documentType),
      this.taxpayerType === '' ? 0 : Number(this.taxpayerType),
      this.state
    );
  }

  onFilterChange(): void {
    this.state = this.tempState;
    this.documentType = this.tempDocumentType;
    this.taxpayerType = this.tempTaxpayerType;
    this.page = 1;
    this.loadEntities();
  }

  trackByEntityId(index: number, entity: EntityBasicResponse): number {
    return entity.id;
  }

  onSelectedEntity(entityId: number): void {
    this.entityService
      .getEntityById(entityId)
      .subscribe((entity: EntityDetailsRespone) => {
        this.initServiceForm(entity);
        this.selectedEntity = entity;
        this.cdr.detectChanges();
        this.isModalOpenOnUpdateData = true;
      });
  }

  requestOptions(entityId: number) {
    this.loader.showLoader();

    const documentRequest = this.documentService.getDocumentList();
    const taxpayerRequest = this.taxpayerService.getTaxpayerList();

    forkJoin([documentRequest, taxpayerRequest])
      .pipe(
        catchError((error) => {
          this.toastService.show('error', 'Error al obtener los datos');
          return throwError(() => error);
        }),
        finalize(() => {
          this.loader.hideLoader();
          this.cdr.detectChanges();
        })
      )
      .subscribe(([documents, taxpayers]) => {
        this.documentList = documents;
        this.taxpayerList = taxpayers;

        // Ahora, que las listas ya se llenaron, obtenemos los detalles del entity
        this.onSelectedEntity(entityId);
      });
  }

  initServiceForm(selectedEntity: EntityDetailsRespone): void {
    // console.log(this.companyId);

    let taxpayerTypeId = null;
    if (selectedEntity.taxpayerTypeBasicResponse) {
      taxpayerTypeId = selectedEntity.taxpayerTypeBasicResponse.id;
    }

    this.entityForm = this.fb.group({
      documentNumber: [selectedEntity.documentNumber, [Validators.required]],
      companyName: [selectedEntity.companyName, [Validators.required]],
      tradeName: [selectedEntity.tradeName],
      address: [selectedEntity.address],
      cellphone: [selectedEntity.cellphone],
      documentTypeId: [selectedEntity.documentTypeBasicResponse.id, [Validators.required]],
      taxpayerTypeId: [taxpayerTypeId],
      state: [selectedEntity.state],
    });

    this.initialFormValuesOnUpdateData = this.entityForm.getRawValue();
    // console.log(this.initialFormValuesOnUpdateData);
  }

  onEntityCreated(entity: EntityBasicResponse): void {
    this.entityState.addEntity(entity);
    this.loadEntities();
  }

  onUpdateData(): void {
    if (this.entityForm.invalid) {
      this.entityForm.markAllAsTouched();
      return; 
    }

    console.log(this.entityForm.getRawValue());

    const requestForm = this.entityForm.getRawValue();

    const request: EntityDetailsRequest = {
      documentNumber: requestForm.documentNumber,
      companyName: requestForm.companyName,
      tradeName: requestForm.tradeName,
      address: requestForm.address,
      cellphone: requestForm.cellphone,
      documentTypeId: requestForm.documentTypeId,
      taxpayerTypeId: requestForm.taxpayerTypeId === 0 ? null : requestForm.taxpayerTypeId,
      state: requestForm.state,
    };
    // console.log(request);

    this.entityService.updateEntity(request, this.selectedEntity.id).subscribe({
      next: (entity: EntityDetailsRespone) => {
        this.toastService.show('success', 'Entidad actualizada correctamente');
        this.entityState.updateEntity(entity, entity.id);
        this.resetForm();
        this.loadEntities();
      },
      error: (err: any) => {
        this.toastService.show('error', 'Error al actualizar la entidad');
        console.error('Error al actualizar la entidad', err);
      },
    });
      
  }

  onDeleteEntity() {
    this.entityService.deleteEntity(this.idToDelete).subscribe({
      next: () => {
        this.toastService.show('success', 'Entidad eliminada correctamente');
        this.entityState.deleteEntity(this.idToDelete);
        this.modalDelete = false;
        this.loadEntities();
      },
      error: (err: any) => {
        this.toastService.show('error', 'Error al eliminar la entidad');
        console.error('Error al eliminar la entidad', err);
      },
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadEntities();
  }

  getVisiblePages(): number[] {
    let startPage = Math.max(
      1,
      this.page - Math.floor(this.maxVisiblePages / 2)
    );
    let endPage = startPage + this.maxVisiblePages - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - this.maxVisiblePages + 1);
    }

    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }
    return visiblePages;
  }

  getStartIndex(): number {
    return (this.page - 1) * this.size + 1;
  }

  getEndIndex(): number {
    return Math.min(this.page * this.size, this.totalElements);
  }

  onSelectOption(name: string | null, title: string) {
    const keyControl = this.entityForm.get(title);
    if (keyControl) {
      keyControl.setValue(Number(name));
      if (name !== null) {
        // console.log(keyControl);
      }
    }
  }

  resetForm() {
    this.isModalOpenOnUpdateData = false;
    this.entityForm.reset(this.initialFormValuesOnUpdateData);
    this.cdr.detectChanges();
  }

  isFormDirtyOnUpdatePrincipalData(): boolean {
    return (JSON.stringify(this.entityForm.getRawValue()) !== JSON.stringify(this.initialFormValuesOnUpdateData));
  }

  openModalDelete(id: number) {
    this.idToDelete = id;
    this.modalDelete = true;
  }

  closeModalDelete() {
    this.modalDelete = false;
  }
}
