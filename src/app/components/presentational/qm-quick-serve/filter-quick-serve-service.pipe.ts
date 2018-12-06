import { Pipe, PipeTransform } from '@angular/core';
// import { IServiceViewModel } from 'src/models/IServiceViewModel';
import { IService } from '../../../../models/IService';

@Pipe({
  name: 'filterQuickServeService'
})
export class FilterQuickServeServicePipe implements PipeTransform {

  transform(services: IService[], filterText?: any): any {

    // var flowType = args[1];
    if (!services || !filterText) {
      return services;
    }
    // console.log(services);
    
    // if (flowType === FLOW_TYPE.CREATE_APPOINTMENT) {
      return services.filter(s => s.internalName.toUpperCase().search(filterText.toUpperCase()) != -1);
    // }
    // else {
      // return services.filter(s => s.internalName.toUpperCase().search(filterText.toUpperCase()) != -1);
    // }

  }

}
