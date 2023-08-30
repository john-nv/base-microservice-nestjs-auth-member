export interface ILoginPayload {
  loginPayload: { username: string; password: string };
  fingerPrint: IFingerPrint;
}

export interface IFingerPrint {
  ipAddress: string;
  deviceId: string;
  userAgent: string;
  country: string;
}
