import { ITimeSlot } from './../../../../models/ITimeSlot';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTimeSlot'
})
export class FilterTimeSlotPipe implements PipeTransform {

  transform(timeSlots: ITimeSlot[], category?: string): any {
    if(!timeSlots || !category) {
      return timeSlots;
    }

    return timeSlots.filter(ts => ts.category.toString() == category);
  }
}
