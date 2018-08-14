import { Pipe, PipeTransform } from '@angular/core';
import { IServiceViewModel } from 'src/models/IServiceViewModel';
import { FLOW_TYPE } from '../../../../util/flow-state';

@Pipe({
  name: 'filterService'
})
export class FilterServicePipe implements PipeTransform {

  transform(services: IServiceViewModel[], args?: any): any {
    var filterText = args[0];
    var flowType = args[1];
    if (!services || !filterText) {
      return services;
    }

    if (flowType === FLOW_TYPE.CREATE_APPOINTMENT) {
      return services.filter(s => s.name.toUpperCase().search(filterText.toUpperCase()) != -1);
    }
    else {
      return services.filter(s => s.internalName.toUpperCase().search(filterText.toUpperCase()) != -1);
    }
  }
}
