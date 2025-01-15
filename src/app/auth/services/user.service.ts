import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.dev';
import { USER_API_ENDPOINTS } from '@core/global/constants/api-endpoints';
import { UserPrincipal } from '@interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private uri = environment.url

  constructor(private http: HttpClient) { }

  getUserByUsername(username: number): Observable<UserPrincipal> {
    return this.http.get<UserPrincipal>(`${this.uri}/${USER_API_ENDPOINTS.GET_BY_ID}/${username}`);
  }
}
