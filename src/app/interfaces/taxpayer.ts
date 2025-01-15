export interface TaxpayerResponse {
  id: number;
  name: string;
  state: boolean;
}

export interface TaxpayerRequest {
  name: string;
  state: boolean;
}