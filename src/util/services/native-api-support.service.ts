import { Injectable } from '@angular/core';
import { NativeApiDispatchers } from '../../store';

@Injectable()
export class NativeApiSupportService {

    constructor(private nativeApiDispatcher: NativeApiDispatchers) {
        
    }

    updateQRCode(qrCode: string){
        this.nativeApiDispatcher.fetchQRCodeInfo(qrCode);
    }

    closeQRCodeScanner(){
        this.nativeApiDispatcher.closeQRCodeScanner();
    }

}