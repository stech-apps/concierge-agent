import { Pipe, PipeTransform } from '@angular/core';
import { IServiceViewModel } from 'src/models/IServiceViewModel';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { merge } from 'rxjs/operators';

@Pipe({
  name: 'filterService'
})

export class FilterServicePipe implements PipeTransform {

  transform(services: IServiceViewModel[], args?: any): any {
    var filterText = args[0].trim();
    var flowType = args[1];
    if (!services || !filterText) {
      return services;
    }

    

    if (flowType === FLOW_TYPE.CREATE_APPOINTMENT) {
      return services.filter(s => s.name.toUpperCase().search(filterText.toUpperCase()) != -1);
    }
    else {
      var NameFilter  = services.filter(s => (s.internalName.toUpperCase().search(filterText.toUpperCase()) != -1));
      var DescriptionFilter  = services.filter(s => (s.internalDescription ? (s.internalDescription.toUpperCase().search(filterText.toUpperCase()) != -1):0));
      
      var concatFilter = NameFilter.concat(DescriptionFilter);
      return getUnique(concatFilter,'id');
    }

    function getUnique(arr, comp) {

      const unique = arr
           .map(e => e[comp])
    
         // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)
    
        // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);
    
       return unique;
    }

    
  }
}
