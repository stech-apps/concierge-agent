import { Pipe, PipeTransform } from '@angular/core';
import { IServiceViewModel } from 'src/models/IServiceViewModel';

@Pipe({
  name: 'filterService'
})
export class FilterServicePipe implements PipeTransform {

  transform(services: IServiceViewModel[], filterText?: any): any {

    if(!services || !filterText) {
      return services;
    }

    return services.filter(s => s.internalName.toUpperCase().search(filterText.toUpperCase()) != -1);
  }
}
