import { Injectable } from "@angular/core";
import { TaxpayerTypeServiceService } from '../../services/taxpayer-type-service.service';
import { BehaviorSubject, Observable } from "rxjs";
import { TaxpayerTypeBasicResponse } from "@interfaces/taxpayer";

@Injectable({
  providedIn: 'root',
})
export class TaxpayerTypeStateService {
    private taxpayerSubject: BehaviorSubject<TaxpayerTypeBasicResponse[]> = new BehaviorSubject<TaxpayerTypeBasicResponse[]>([]);
		taxpayer$: Observable<TaxpayerTypeBasicResponse[]> = this.taxpayerSubject.asObservable();

    constructor(private taxpayerService: TaxpayerTypeServiceService) {}

		loadTaxpayerTypes(): void {
			this.taxpayerService.getAllTaxpayerTypes().subscribe((taxpayerTypes: TaxpayerTypeBasicResponse[]) => {
				this.taxpayerSubject.next(taxpayerTypes);
			});
		}

		addTaxpayerType(taxpayerTypeRequest: TaxpayerTypeBasicResponse): void {
			const taxpayerTypes = this.taxpayerSubject.getValue();
			taxpayerTypes.unshift(taxpayerTypeRequest);
			this.taxpayerSubject.next(taxpayerTypes);
		}

		updateTaxpayerType(taxpayerTypeRequest: TaxpayerTypeBasicResponse, id: number): void {
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