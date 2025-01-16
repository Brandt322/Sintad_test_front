import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENTITY_API_ENDPOINTS } from '@core/global/constants/api-endpoints';
import { environment } from '@environments/environment.prod';
import {
  EntityBasicResponse,
  EntityDetailsRequest,
  EntityDetailsRespone,
} from '@interfaces/entity';
import { PagedResponse } from '@interfaces/Pageable';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntityServiceService {
  baseUrl = environment.url;

  constructor(private httpClient: HttpClient) {}

  getAllEntities(
    page: number,
    size: number,
    documentType: number,
    taxpayerType: number,
    state: string
  ): Observable<PagedResponse<EntityBasicResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('documentType', documentType)
      .set('taxpayerType', taxpayerType)
      .set('state', state);

    return this.httpClient.get<PagedResponse<EntityBasicResponse>>(
      `${this.baseUrl}/${ENTITY_API_ENDPOINTS.FIND_ALL}`,
      { params }
    );
  }

  getEntityById(id: number): Observable<EntityDetailsRespone> {
    return this.httpClient.get<EntityDetailsRespone>(
      `${this.baseUrl}/${ENTITY_API_ENDPOINTS.FIND_BY_ID}/${id}`
    );
  }

  saveEntity(
    entityRequest: EntityDetailsRequest
  ): Observable<EntityDetailsRespone> {
    return this.httpClient.post<EntityDetailsRespone>(
      `${this.baseUrl}/${ENTITY_API_ENDPOINTS.CREATE}`,
      entityRequest
    );
  }

  updateEntity(
    entityRequest: EntityDetailsRequest,
    id: number
  ): Observable<EntityDetailsRespone> {
    return this.httpClient.put<EntityDetailsRespone>(
      `${this.baseUrl}/${ENTITY_API_ENDPOINTS.UPDATE}/${id}`,
      entityRequest
    );
  }

  deleteEntity(id: number) {
    return this.httpClient.delete(
      `${this.baseUrl}/${ENTITY_API_ENDPOINTS.DELETE}/${id}`,
      { responseType: 'text' }
    );
  }
}
