import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: any[] = [];
  public toastState = new BehaviorSubject<any[]>(this.toasts);

  constructor() { }

  show(type: string, message: string, time = 3000): void {
    const toast = { type, message, time, id: Date.now() };
    this.toasts.push(toast);
    this.toastState.next(this.toasts);

    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== toast.id);
      this.toastState.next(this.toasts);
    }, time);
  }
}
