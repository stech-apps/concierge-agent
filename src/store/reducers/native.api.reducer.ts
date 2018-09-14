import * as NativeApiActions from '../actions/native.api.actions';

export interface NativeApiState {
  qrCode: string;
  isQRCodeScannerLoaded: boolean;
}

const initialState = {
  qrCode: null,
  isQRCodeScannerLoaded: false
};

export function reducer(
  state: NativeApiState = initialState,
  action: NativeApiActions.AllNativeApiActions
): NativeApiState {
  switch (action.type) {
    case NativeApiActions.FETCH_QR_CODE: {
      return {
        ...state,
        qrCode: null,
        isQRCodeScannerLoaded: true
      };
    }
    case NativeApiActions.FETCH_QR_CODE_SUCCESS: {
      return {
        ...state,
        qrCode: action.payload
      };
    }
    case NativeApiActions.RESET_QR_CODE_SCANNER: {
      return {
        ...state,
        isQRCodeScannerLoaded: false
      };
    }
    case NativeApiActions.RESET_QR_CODE: {
      return {
        ...state,
        qrCode: null,
        isQRCodeScannerLoaded: false
      };
    }
    default: {
      return state;
    }
  }
}
