import { IService } from "./IService";

export class ICalendarService extends IService {
    duration: number;
    publicEnabled: boolean;
    additionalCustomerDuration: number;
    name: string;
    active: boolean;
    publicId: string;
  }
  