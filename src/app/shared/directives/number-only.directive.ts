import { Directive, ElementRef, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]',
  standalone: true,
})
export class NumberOnlyDirective {
  allowDecimal = input(false);

  constructor() {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'End',
      'Home',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
    ];

    if (
      allowedKeys.includes(event.key) ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.ctrlKey &&
        ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) ||
      // Allow: Command+A (for Mac)
      (event.metaKey && event.key.toLowerCase() === 'a')
    ) {
      return;
    }

    const decimalRegex = this.allowDecimal() ? /^[0-9.]$/ : /^[0-9]$/;

    if (event.key && !decimalRegex.test(event.key)) {
      event.preventDefault();
    }

    // Prevent more than one decimal point
    if (this.allowDecimal() && event.key === '.') {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.value.includes('.')) {
        event.preventDefault();
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData =
      event.clipboardData || (window as any)['clipboardData'];
    const pastedText = clipboardData.getData('text');
    const decimalRegex = this.allowDecimal() ? /^\d*\.?\d*$/ : /^\d*$/;

    if (pastedText && !decimalRegex.test(pastedText)) {
      event.preventDefault();
    }
  }
}
