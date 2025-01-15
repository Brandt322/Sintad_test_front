import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { EMPTY, Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from '../loader/loader.service';
import { ToastService } from '@core/toast/toast.service';

interface ResponseBody {
  error?: string;
  errorMessage?: string;
}

@Injectable()
export class ServerErrorsInterceptor implements HttpInterceptor {

  constructor(private route: Router, private loader: LoaderService, private toastService: ToastService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loader.showLoader();
    return next.handle(request).pipe(tap(event => {
      if (event instanceof HttpResponse) {
        const body = event.body as ResponseBody;
        if (body && body.error === 'true' && body.errorMessage) {
          throw new Error(body.errorMessage);
        }
      }
    })).pipe(catchError((error: any) => {
      console.log("Error con codigo: " + error.status + "\n Mensaje: " + error.message + "\n Error: " + error);

      switch (error.status) {
        case 0:
          // this.messageService.add({ severity: 'error', summary: 'Error servidor', detail: 'Error de conexión con el servidor Backend', life: 2000 });
          this.toastService.show('error', 'Error de conexión con el servidor Backend');
          break;
        case 400:
          let detail400 = error.error.message || error.error;
          let summary400 = 'Advertencia';
          if (detail400 === 'Los datos ingresados ya se encuentran registrados') {
            summary400 = 'Advertencia';
          } else if (detail400 === 'El nombre de usuario y/o la contraseña no son válidos') {
            summary400 = 'Error';
          }
          this.toastService.show('alert', detail400);
          break;
        case 401:
          let detail401 = error.error.message || error.error.error || error.error || 'No autorizado';
          this.toastService.show('alert', detail401);
          if (detail401 !== 'No autorizado') {
            this.route.navigate(['/login']);
          }
          break;
        case 404:
          let detail404 = error.error.message || error.error.error || error.error || 'No se encontraron registros';
          console.log(detail404);
          this.toastService.show('normal', detail404);
          return throwError(() => error);
        case 500:
          this.toastService.show('error', 'Error, intentalo más tarde');
          break;
        default:
          return EMPTY;
      }

      return EMPTY;
    }),
      finalize(() => this.loader.hideLoader())
    );
  }
}
