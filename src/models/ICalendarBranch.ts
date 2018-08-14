import { IBranch } from "./IBranch";

export class ICalendarBranch extends IBranch {
    publicId: string;
    qpId: number;
    selected?: boolean;
}
  