import { Pipe, PipeTransform } from '@angular/core';
import { Queue } from '../../../../models/IQueue';

@Pipe({
  name: 'filterQueue'
})
export class FilterQueuePipe implements PipeTransform {

  
  transform(queues: Queue[], filterText?: any): any {
    filterText =  (filterText || '').trim();
    if(!queues || !filterText) {
      return queues;
    }

    return queues.filter(b => b.queue.toUpperCase().includes(filterText.toUpperCase()));
  }

}
