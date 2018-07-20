import { IDeliveredService } from "./IDeliveredService";
import { IOutcome } from "./IOutcome";

export class IServiceConfiguration {
    id: number;
    internalName: string;
    externalName: string;
    deliveredServices: IDeliveredService[];
    outcomes: IOutcome[];
  }
