import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'qmhighlight'
})
export class QmHighlightPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let transformedText = value;
    if (value && args) {
      const rx = new RegExp(args, 'i');
      const matches = rx.exec(value);
      if (matches.length > 0) {
        transformedText = value.replace(rx, '<mark>' + matches[0] + '</mark>');
      }
    }
    return transformedText;
  }
}
