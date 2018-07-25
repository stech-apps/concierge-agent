import { Injectable } from '@angular/core';
import { Queue } from "src/models/IQueue";


@Injectable()
export class QueueIndicator {
     isGrayIndicator (queueInfo: Queue)  {
        return (queueInfo.waitingTime / 60) < (queueInfo.serviceLevel * 0.75);
    }
    
    isYellowIndicator (queueInfo)  {
        return ((queueInfo.waitingTime / 60) >= (queueInfo.serviceLevel * 0.75)) && ((queueInfo.waitingTime / 60) < queueInfo.serviceLevel);
    }
    
    isRedIndicator (queueInfo) {
        return (queueInfo.waitingTime / 60) >= queueInfo.serviceLevel;
    }
}
