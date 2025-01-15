import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TAXPAYER_API_ENDPOINTS } from '@core/global/constants/api-endpoints';
import { environment } from '@environments/environment.dev';
import { TaxpayerRequest, TaxpayerResponse } from '@interfaces/taxpayer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaxpayerTypeServiceService {
  baseUrl = environment.url;

  constructor(private httpClient: HttpClient) {}

  getAllTaxpayerTypes(): Observable<TaxpayerResponse[]> {
    return this.httpClient.get<TaxpayerResponse[]>(`${this.baseUrl}/${TAXPAYER_API_ENDPOINTS.FIND_ALL}`);
  }

  getTaxpayerTypeById(id: number): Observable<TaxpayerResponse> {
    return this.httpClient.get<TaxpayerResponse>(`${this.baseUrl}/${TAXPAYER_API_ENDPOINTS.FIND_BY_ID}/${id}`);
  }

  saveTaxpayerType(taxpayerType: TaxpayerRequest): Observable<TaxpayerResponse> {
    const url = `${this.baseUrl}/${TAXPAYER_API_ENDPOINTS.CREATE}`;
    return this.httpClient.post<TaxpayerResponse>(url, taxpayerType);
  }

  updateTaxpayerType(id: number, taxpayerType: TaxpayerRequest): Observable<TaxpayerResponse> {
    const url = `${this.baseUrl}/${TAXPAYER_API_ENDPOINTS.UPDATE}/${id}`;
    return this.httpClient.put<TaxpayerResponse>(url, taxpayerType);
  }

  deleteTaxpayerType(id: number) {
    const url = `${this.baseUrl}/${TAXPAYER_API_ENDPOINTS.DELETE}/${id}`;
    return this.httpClient.delete(url, { responseType: 'text' });
  }
}
