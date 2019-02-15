import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'qmDropDownFilter'
})
export class QmDropDownFilterPipe implements PipeTransform {

  transform(items: Array<any>, filterText?: any, labelProperty = 'text'): any {
    filterText =  (filterText || '').trim();
    if(!items || !filterText) {
      return items;
    }
    
    return items.filter(b => b[labelProperty].toUpperCase().search(filterText.toUpperCase()) != -1) || {};
  }
}
