import { Pipe, PipeTransform } from '@angular/core';
import { Queue } from '../../../../models/IQueue';

@Pipe({
  name: 'filterQueue'
})
export class FilterQueuePipe implements PipeTransform {

  
  transform(queues: Queue[], filterText?: any,SortBase?:string,sortAccending?:string): any {
    queues = queues.filter(q=>q.queueType=="QUEUE")
    filterText =  (filterText || '').trim();
    if(!queues || !filterText) {
      return queues;
    }else{
      let queueList = queues.filter(b => b.queue.toUpperCase().includes(filterText.toUpperCase()));
      return queueList
    }
 
  }

  
  sortQueueList(queueList, type, sortAscending) {
    
    // sort by name
    queueList = queueList.sort((a, b) => {

          if(type=="SERVICE_POINT"){
            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
           } else if (type == "STATE"){
            var nameA = a.state.toUpperCase();
            var nameB = b.state.toUpperCase();
           }
            if ((nameA < nameB && sortAscending) || (nameA > nameB && !sortAscending) ) {
              return -1;
            }
            if ((nameA > nameB && sortAscending) || (nameA < nameB && !sortAscending)) {
              return 1;
            }
            // names must be equal
            return 0;
      });


}
}
