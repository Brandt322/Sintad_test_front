export interface DocumentsResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  state: boolean;
}

export interface DocumentsRequest {
  code: string;
  name: string;
  description: string;
  state: boolean;
}
