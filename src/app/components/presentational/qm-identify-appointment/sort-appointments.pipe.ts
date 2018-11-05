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
    path: any[],
    isDesending: boolean = null
  ): IAppointment[] {
    console.log(path);
    // Check if is not null\
    if (!appointments || !path) return appointments;

    let sortColumns = [];
    let sortDirections = [];

    //process priority sort columns first

    for (const pkey of path[1]) {
      if (pkey) {
        sortColumns.push(pkey);
        sortDirections.push(path[0][pkey] > 0 ? "desc" : "asc");
      }
    }

    for (const key of Object.keys(path[0])) {
      if (path[0][key] != 0 && sortColumns.indexOf(key)=== -1) { 
        sortColumns.push(key);
        sortDirections.push(path[0][key] > 0 ? "desc" : "asc");
      }
    }

    return _.orderBy(appointments, sortColumns, sortDirections);
  }
}
