import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="control && control.invalid && (control.dirty || control.touched)"
      class="text-red-700 font-semibold fade-in"
      [class]="alignRight ? 'lg:text-start' : 'lg:text-end'"
      [style]="{ 'font-size': '10px' }"
    >
      <span *ngIf="control.errors?.['required']" >{{ errorMessage }}</span>
      <span *ngIf="control.errors?.['pattern']" >{{patternMessage}}</span>
      <span *ngIf="control.errors?.['minlength']" [class]="alignRight ? 'flex ' : 'flex justify-end'">{{ minMessage }}</span>
      <span *ngIf="control.errors?.['maxlength']" [class]="alignRight ? 'flex ' : 'flex justify-end'">{{ maxMessage }}</span>
      <span *ngIf="control.errors?.['email']" [class]="alignRight ? 'flex ' : 'flex justify-end'">{{ correoMessage }}</span>
    </div>
  `,
})
export class FormErrorComponent {
  @Input() dateMessage?: string;
  @Input() patternMessage?: string;
  @Input() correoMessage?: string;
  @Input() minMessage?: string;
  @Input() maxMessage?: string;
  @Input() errorMessage!: string;
  @Input() messageDate?: string;
  @Input() control!: AbstractControl | null;
  @Input() alignRight: boolean = false;
}
