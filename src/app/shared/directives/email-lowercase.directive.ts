import { Directive, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[appEmailLowercase]',
  standalone: true,
  host: {
    '(input)': 'onInput($event)',
    '(blur)': 'onTouched()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EmailLowercaseDirective),
    multi: true,
  }],
})
export class EmailLowercaseDirective implements ControlValueAccessor {
  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private element: ElementRef<HTMLInputElement>) {}

  writeValue(value: string | null): void {
    this.element.nativeElement.value = String(value ?? '').toLowerCase();
  }

  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.element.nativeElement.disabled = disabled; }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.value = input.value.toLowerCase();
    if (start !== null && end !== null) input.setSelectionRange(start, end);
    this.onChange(input.value);
  }
}
