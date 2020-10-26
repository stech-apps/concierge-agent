import { Pipe, PipeTransform } from '@angular/core';
import { IServicePoint } from '../../../../models/IServicePoint';

@Pipe({
  name: 'filterServicePoints'
})
export class FilterServicePointsPipe implements PipeTransform {

  transform(sps: IServicePoint[], filterText?: any, SortBase?:string,sortAccending?:string): any {
    filterText =  (filterText || '').trim();
    if(!sps || !filterText) {
      return sps
    }
    else{
      let servicePoints = sps.filter(b => b.name.toUpperCase().includes(filterText.toUpperCase()));
       return servicePoints;
    }
  }

  
  
  sortQueueList(servicePoints,sortAscending) {
    
      // sort by name
      servicePoints = servicePoints.slice().sort((a, b) => {

              var nameA = a.name.toUpperCase(); // ignore upper and lowercase
              var nameB = b.name.toUpperCase(); // ignore upper and lowercase
            
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
