import { Injectable } from "@angular/core";
import { TaxpayerTypeServiceService } from '../../services/taxpayer-type-service.service';
import { BehaviorSubject, Observable } from "rxjs";
import { TaxpayerResponse } from "@interfaces/taxpayer";

@Injectable({
  providedIn: 'root',
})
export class TaxpayerTypeStateService {
    private taxpayerSubject: BehaviorSubject<TaxpayerResponse[]> = new BehaviorSubject<TaxpayerResponse[]>([]);
		taxpayer$: Observable<TaxpayerResponse[]> = this.taxpayerSubject.asObservable();

    constructor(private taxpayerService: TaxpayerTypeServiceService) {}

		loadTaxpayerTypes(): void {
			this.taxpayerService.getAllTaxpayerTypes().subscribe((taxpayerTypes: TaxpayerResponse[]) => {
				this.taxpayerSubject.next(taxpayerTypes);
			});
		}

		addTaxpayerType(taxpayerTypeRequest: TaxpayerResponse): void {
			const taxpayerTypes = this.taxpayerSubject.getValue();
			taxpayerTypes.unshift(taxpayerTypeRequest);
			this.taxpayerSubject.next(taxpayerTypes);
		}

		updateTaxpayerType(taxpayerTypeRequest: TaxpayerResponse, id: number): void {
			const taxpayerTypes = this.taxpayerSubject.getValue();
			const index = taxpayerTypes.findIndex((taxpayerType) => taxpayerType.id === id);
			if (index !== -1) {
				taxpayerTypes[index] = {
					...taxpayerTypes[index],
					...taxpayerTypeRequest,
				};
				this.taxpayerSubject.next(taxpayerTypes);
			}
		}

		deleteTaxpayerType(taxpayerTypeId: number): void {
			const taxpayerTypes = this.taxpayerSubject.getValue();
			const updatedTaxpayerTypes = taxpayerTypes.filter((taxpayerType) => taxpayerType.id !== taxpayerTypeId);
			this.taxpayerSubject.next(updatedTaxpayerTypes);
		}

}