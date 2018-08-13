import { ICustomerProperty } from "./ICustomerProperty";

export interface ICustomer {
  id?: number;
  qpId?: number;
  firstName: string;
  lastName: string;
  properties: ICustomerProperty;
  publicId?: string;
  lastInteractionTimestamp?: string;
  deletionTimestamp?: string;
  retentionPolicy?: string;
  name?: string;
  email?: string;
  phone?: string;
  identificationNumber?: string;
  cardNumber?: string;
  created?: string;
}
