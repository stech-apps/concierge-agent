export interface IMessageBox{
    firstLineName?:string;
    firstLineText?:string;
    SecondLineName?:string;
    SecondLineText?:string;
    icon?:string;
    LastLineName?:string;
    LastLineText?:string;

    heading?: string;
    subheading?: string;
    fieldList?: Array<any>;
    dynamicTransKeys? : any;
    fieldListHeading?: string;
}