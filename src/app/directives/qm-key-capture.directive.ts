import { Directive, HostListener, Output , EventEmitter} from '@angular/core';

@Directive({
  selector: '[qmKeyCapture]'
})
export class QmKeyCaptureDirective {

  constructor() { }

 @Output() qmKeyCapture: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  @HostListener('keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    this.qmKeyCapture.emit(event);
    event.stopPropagation();
  }
}
