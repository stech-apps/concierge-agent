import { TranslateService } from "@ngx-translate/core";
import { IAppointment } from "src/models/IAppointment";
import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";

@Pipe({
  name: "sortAppointments"
})
export class SortAppointmentsPipe implements PipeTransform {
  /**
   *
   */
  constructor(private translateService: TranslateService) {}

  transform(
    appointments: IAppointment[],
    sortColumn: string,
    isDesending: boolean = null
  ): IAppointment[] {
    console.log(sortColumn);
    // Check if is not null\
    if (!appointments || !sortColumn || isDesending === null) return appointments;


    
    return _.orderBy(
      appointments,
      sortColumn,
      isDesending ? "desc" : "asc"
    );
  }
}
