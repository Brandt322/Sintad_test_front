import { DocumentsResponse } from './documents';
import { TaxpayerTypeBasicResponse } from './taxpayer';

export interface EntityBasicResponse {
  id: number;
  documentNumber: string;
  companyName: string;
  tradeName: string;
  state: boolean;
  taxpayerTypeBasicResponse: TaxpayerTypeBasicResponse | null;
  documentTypeBasicResponse: DocumentsResponse;
}

export interface EntityDetailsRespone {
  id: number;
  documentNumber: string;
  companyName: string;
  tradeName: string;
  state: boolean;
  address: string;
  cellphone: string;
  taxpayerTypeBasicResponse: TaxpayerTypeBasicResponse | null;
  documentTypeBasicResponse: DocumentsResponse;
}

export interface EntityDetailsRequest {
  documentNumber: string;
  companyName: string;
  tradeName: string;
  address: string;
  cellphone: string;
  taxpayerTypeId: number | null;
  documentTypeId: number;
  state: boolean;
}
