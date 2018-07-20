import { IOutcome } from './IOutcome';

export interface IDeliveredService {
    id: number;
    name: string;
    outcome: IOutcome[];
}