import { Pipe, PipeTransform } from '@angular/core';
import { IStaffPool } from '../../../../models/IStaffPool';

@Pipe({
  name: 'filterStaffPool'
})
export class FilterStaffPoolPipe implements PipeTransform {

  transform(StaffPool: IStaffPool[], filterText?: any): any {
    filterText =  (filterText || '').trim();
    if(!StaffPool || !filterText) {
      return StaffPool;
    }
    return StaffPool.filter(b => b.firstName.toUpperCase().includes(filterText.toUpperCase())|| b.lastName.toUpperCase().includes(filterText.toUpperCase())|| (b.firstName + ' ' + b.lastName).toUpperCase().includes(filterText.toUpperCase()));
  }


}
