import { Injectable } from '@angular/core';
import { EntityBasicResponse } from '@interfaces/entity';
import { BehaviorSubject, Observable } from 'rxjs';
import { EntityServiceService } from '../../services/entity-service.service';
import { PagedResponse } from '@interfaces/Pageable';

@Injectable({
  providedIn: 'root',
})
export class EntityStateService {
  private entitiesSubject: BehaviorSubject<EntityBasicResponse[]> = new BehaviorSubject<EntityBasicResponse[]>([]);
  entities$: Observable<EntityBasicResponse[]> = this.entitiesSubject.asObservable();

  private totalElementsSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalElements$: Observable<number> = this.totalElementsSubject.asObservable();

  private totalPagesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();

  constructor(private entityService: EntityServiceService) {}

  getServices(): Observable<EntityBasicResponse[]> {
    return this.entities$;
  }

  getTotalElements(): Observable<number> {
    return this.totalElements$;
  }

  getTotalPages(): Observable<number> {
    return this.totalPages$;
  }

  loadEntities(page: number, size: number, documentType: number, taxpayerType: number, state: string): void {
    this.entityService.getAllEntities(page, size, documentType, taxpayerType, state).subscribe((entities: PagedResponse<EntityBasicResponse>) => {
      this.entitiesSubject.next(entities.content);
      this.totalElementsSubject.next(entities.totalElements);
      this.totalPagesSubject.next(entities.totalPages);
    });
  }

  addEntity(entity: EntityBasicResponse): void {
    const entities = this.entitiesSubject.getValue();
    entities.unshift(entity);
    this.entitiesSubject.next(entities);
  }

  updateEntity(entity: EntityBasicResponse, id: number): void {
    const entities = this.entitiesSubject.getValue();
    const index = entities.findIndex((entity) => entity.id === id);
    if (index !== -1) {
      entities[index] = {
        ...entities[index],
        ...entity,
      };
      this.entitiesSubject.next(entities);
    }
  }

  deleteEntity(entityId: number): void {
    const entities = this.entitiesSubject.getValue();
    const updatedEntities = entities.filter((entity) => entity.id !== entityId);
    this.entitiesSubject.next(updatedEntities);
  }
}
