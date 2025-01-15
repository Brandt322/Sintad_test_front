import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticationService } from '@auth/services/authentication.service';
import { ToastService } from '@core/toast/toast.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService, private toastService: ToastService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let intReq = request;

    const token = this.authenticationService.getToken();
    // console.log('TokenInterceptor', token);
    if (token != null) {
      intReq = request.clone({ 
      headers: request.headers.set('Authorization', 'Bearer ' + token),
      withCredentials: true // Permite enviar cookies/credenciales
    });
    }
    // console.log('TokenInterceptor', intReq.headers.get('Authorization'));

    return next.handle(intReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or unauthorized
          this.toastService.show('alert', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.authenticationService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
