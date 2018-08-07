import { ICustomerProperty } from "./ICustomerProperty";

export interface ICustomer {
  id?: number;
  firstName: string;
  lastName: string;
  properties: ICustomerProperty;
  publicId?: string;
  lastInteractionTimestamp?: string;
  deletionTimestamp?: string;
  retentionPolicy?: string;
  name?: string;
}
