import { Component, OnInit } from '@angular/core';
import { ToastService } from './toast.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0%)' })),
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.3s')
      ]),
      transition(':leave', [
        animate('0.3s', style({ transform: 'translateX(100%)' }))
      ]),
    ]),
  ],
  standalone: true,
  imports: [CommonModule]
})
export class ToastComponent implements OnInit {
  message = ''
  type = ''
  isVisible = false;
  toasts: any[] = [];
  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toastState.subscribe((toasts: any[]) => {
      this.toasts = toasts;
    });
  }

}
