import { Injectable } from '@angular/core';

@Injectable()
export class Util {
    constructor() {
    }

    compareVersions(baseVersion, currentVersion){
        if (typeof baseVersion + typeof currentVersion != '')
            return -1;
    
        var a = baseVersion.split('.')
        ,   b = currentVersion.split('.')
        ,   i = 0, len = Math.max(a.length, b.length);
        
        for (; i < len; i++) {
            if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
                return 1;
            } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
                return -1;
            }
        }
        return 0;
    }
}
