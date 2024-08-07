import { Directive, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appAlphaNumeric]',
  standalone: true,
})
export class AlphaNumericDirective {
  allowNumbers = input(false);

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

    const alphanumericRegex = this.allowNumbers()
      ? /^[a-zA-Z0-9]$/
      : /^[a-zA-Z]$/;

    if (event.key && !alphanumericRegex.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData =
      event.clipboardData || (window as any)['clipboardData'];
    const pastedText = clipboardData.getData('text');
    const alphanumericRegex = this.allowNumbers()
      ? /^[a-zA-Z0-9]*$/
      : /^[a-zA-Z]*$/;

    if (pastedText && !alphanumericRegex.test(pastedText)) {
      event.preventDefault();
    }
  }
}
