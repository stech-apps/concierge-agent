import { IUTTParameter } from "./IUTTParameter";

export interface IServicePoint {
    id: number;
    name: string;
    unitId: string;
    parameters: IUTTParameter;
    state: string;
}
  