import { TranslateService } from '@ngx-translate/core';
import { SortColumns } from './sort-columns.enum';
import { IAppointment } from 'src/models/IAppointment';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Pipe({
  name: 'sortAppointments'
})
export class SortAppointmentsPipe implements PipeTransform {
  /**
   *
   */
  constructor(private translateService: TranslateService) {

    
  }

  transform(appointments: IAppointment[], path: string[], isDesending: boolean = null): IAppointment[] {

    // Check if is not null
    if (!appointments || !path) return appointments;

    return appointments.sort((a: IAppointment, b: IAppointment) => {
      // We go for each property followed by path
      let compareA = '', compareB = '';
      path.forEach(property => {
        if(property.endsWith('Date')) {
          property = property.replace('Date', '');
        }
        if (property === SortColumns.first_name || SortColumns.last_name === property) {
          if (a.customers[0]) {
            compareA = a.customers[0][property];
          }
          else {
            compareA = '';
          }

          if (b.customers[0]) {
            compareB = b.customers[0][property];
          }
          else {
            compareB = '';
          }

        }
        else if(property === SortColumns.services) {
          compareA = a.services.length > 1 ? a.services.length.toString(): (a.services[0]? a.services[0].name: '');
          compareB = b.services.length > 1 ? b.services.length.toString() : (b.services[0]? b.services[0].name : '');
        }
        else if(property === SortColumns.branch) {
          compareA = a.branch.name;
          compareB = b.branch.name;
        }
        else {
          compareA = a[property];
          compareB = b[property];
        }

      })

      if(!isDesending){
        return compareA == compareB ? 0 : +(compareA > compareB) || -1;
      }
      else {
        return compareA == compareB ? 0 : +(compareA < compareB) || -1;
      }

    });
  }

}
