enum COMPATIBLE_STATUS {
    COMPATIBLE,
    INCOMPATIBLE
}

const ADVANCED_CUSTOMER_SEARCH = ['4.1.0.780', '4.2.0.868'];

export function AdvancedSearchCompatible(currentVersion : string) {
    let status = getCompatibleStatus(ADVANCED_CUSTOMER_SEARCH, currentVersion);
    if (status === COMPATIBLE_STATUS.COMPATIBLE) {
        return true;
    } else {
        return false;
    }
  }

function compareVersions(baseVersion, currentVersion) {
    var a = baseVersion.split('.')
        , b = currentVersion.split('.')
        , i = 0, len = Math.max(a.length, b.length);

    for (; i < len; i++) {
        if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
            return 1;
        } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
            return -1;
        }
    }
    return 0;
}

function getCompatibleStatus(featureType, currentVersion) {
    let currentBaseVersion = currentVersion.substring(0, 4);
    let featureBase = featureType.find(element => (element.indexOf(currentBaseVersion) != -1));
    if (featureBase) {
        let status = compareVersions(featureBase, currentVersion);
        return status <= 0 ? COMPATIBLE_STATUS.COMPATIBLE : COMPATIBLE_STATUS.INCOMPATIBLE;
    } else if (compareVersions(featureType[featureType.length - 1], currentVersion) < 0) {
        return COMPATIBLE_STATUS.COMPATIBLE;
    } else {
        return COMPATIBLE_STATUS.INCOMPATIBLE;
    }
}