import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DOCUMENTS_API_ENDPOINTS } from '@core/global/constants/api-endpoints';
import { environment } from '@environments/environment.prod';
import { DocumentsRequest, DocumentsResponse, DocumentTypeBasicResponse } from '@interfaces/documents';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeServiceService {
  baseUrl = environment.url;

  constructor(private httpClient: HttpClient) { }

  getAllDocuments():Observable<DocumentsResponse[]> {
    return this.httpClient.get<DocumentsResponse[]>(`${this.baseUrl}/${DOCUMENTS_API_ENDPOINTS.FIND_ALL}`);
  }

  getDocumentById(id: number): Observable<DocumentsResponse> {
    return this.httpClient.get<DocumentsResponse>(`${this.baseUrl}/${DOCUMENTS_API_ENDPOINTS.FIND_BY_ID}/${id}`);
  }

  saveDocument(document: DocumentsRequest): Observable<DocumentsResponse> {
    const url = `${this.baseUrl}/${DOCUMENTS_API_ENDPOINTS.CREATE}`;
    return this.httpClient.post<DocumentsResponse>(url, document);
  }

  updatedocument(id: number, document: DocumentsRequest): Observable<DocumentsResponse> {
    const url = `${this.baseUrl}/${DOCUMENTS_API_ENDPOINTS.UPDATE}/${id}`;
    return this.httpClient.put<DocumentsResponse>(url, document);
  }

  deleteDocument(id: number) {
    const url = `${this.baseUrl}/${DOCUMENTS_API_ENDPOINTS.DELETE}/${id}`;
    return this.httpClient.delete(url, { responseType: 'text' });
  }

  getDocumentList(): Observable<DocumentTypeBasicResponse[]> {
    return this.httpClient.get<DocumentTypeBasicResponse[]>(`${this.baseUrl}/${DOCUMENTS_API_ENDPOINTS.LIST}`);
  }
}
