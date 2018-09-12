import { Pipe, PipeTransform } from '@angular/core';
import { IServicePoint } from '../../../../models/IServicePoint';

@Pipe({
  name: 'filterServicePoints'
})
export class FilterServicePointsPipe implements PipeTransform {

  transform(sps: IServicePoint[], filterText?: any): any {
    filterText =  (filterText || '').trim();
    if(!sps || !filterText) {
      return sps;
    }

    return sps.filter(b => b.name.toUpperCase().includes(filterText.toUpperCase()));
  }
}
