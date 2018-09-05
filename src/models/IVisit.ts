export interface Visit {
    ticketId: string,
    visitId: number,
    waitingTime: number,
    totalWaitingTime: number,
    appointmentId: number,
    appointmentTime: any,
    queueId: number,
    customerName?:string,
    serviceName?:string,
    ticketNumber?:string,
    parameterMap?:any,
    waitingTimeStr?:any,
    currentVisitService?:any,
    id?:number
  
  }
