import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
})
export class TextInputComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() value: string = '';
  @Input() isDisabled: boolean = false;
  @Input() readonly: boolean = false;
  @Output() valueChange = new EventEmitter<string>();

  isInvalid: boolean = false;

  onChange = (value: any) => { };

  onTouched = () => { };

  checkValidity(): void {
    this.isInvalid = !this.value || this.value === 'null';
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onBlur(): void {
    this.isInvalid = !this.value;
    this.onTouched();
  }

  onFocus(): void {
    this.isInvalid = false;
  }
}
