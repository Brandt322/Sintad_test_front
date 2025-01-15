import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.css'
})
export class SelectInputComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() data?: { id: number | null; name: string }[];
  @Input() value: string = 'null';
  @Input() optionName!: string;
  @Input() disabled: boolean = false;
  @Output() optionSelected = new EventEmitter<string | null>();

  isInvalid: boolean = false;

  checkValidity(): void {
    this.isInvalid = !this.value || this.value === 'null';
  }
  onOptionSelected(event: any) {
    const value = event.target.value === 'null' ? null : event.target.value;
    this.value = value;
    this.optionSelected.emit(value);
    this.isInvalid = !value;
  }

  resetSelect(): void {
    this.value = 'null';
    this.isInvalid = false;
    this.optionSelected.emit(null);
  }

  onBlur(): void {
    this.isInvalid = !this.value || this.value === 'null';
  }

  onFocus(): void {
    this.isInvalid = false;
  }
}
