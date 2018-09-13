import { Action } from '@ngrx/store';

// Fetching user info
export const FETCH_QR_CODE = '[Native Api] FETCH_QR_CODE';
export const FETCH_QR_CODE_SUCCESS = '[Native Api] FETCH_QR_CODE_SUCCESS';
export const RESET_QR_CODE_SCANNER = '[Native Api] RESET_QR_CODE_SCANNER';
export const RESET_QR_CODE = '[Native Api] RESET_QR_CODE';

export class OpenQRCodeScanner implements Action {
    readonly type = FETCH_QR_CODE;
  }

export class FetchQRCodeInfo implements Action {
  readonly type = FETCH_QR_CODE_SUCCESS;
  constructor(public payload: string) {}
}

export class ResetQRCodeScanner implements Action {
    readonly type = RESET_QR_CODE_SCANNER;
}

export class ResetQRCode implements Action {
  readonly type = RESET_QR_CODE;
}

// Action types
export type AllNativeApiActions =
    OpenQRCodeScanner 
  | FetchQRCodeInfo
  | ResetQRCodeScanner
  | ResetQRCode;