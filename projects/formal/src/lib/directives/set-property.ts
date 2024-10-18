import { ElementRef, inject, Renderer2 } from '@angular/core';

export function injectSetProperty() {
  const elementRef = inject(ElementRef<HTMLInputElement>);
  const renderer = inject(Renderer2);

  return function setProperty(key: string, value: any): void {
    renderer.setProperty(elementRef.nativeElement, key, value);
  };
}
