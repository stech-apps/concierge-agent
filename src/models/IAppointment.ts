import { ICustomer } from './ICustomer';
import { IBranch } from './IBranch';
import { IService } from './IService';

export interface IAppointment {
  publicId?: string;
  status?: number;
  created?: number;
  updated?: number;
  start?: string;
  numberOfCustomers?: number;
  custom?: string;
  customers?: ICustomer[];
  branch?: IBranch;
  services?: IService[];
  title?: string;
  notes?: string;
  allDay?: boolean;
  blocking?: boolean;
  end?: string;
  deleted?: boolean;
}
