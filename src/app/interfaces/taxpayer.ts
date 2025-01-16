export interface TaxpayerTypeBasicResponse {
  id: number;
  name: string;
  state: boolean;
}

export interface TaxpayerRequest {
  name: string;
  state: boolean;
}

export interface TaxpayerBasicListResponse {
  id: number;
  name: string;
}