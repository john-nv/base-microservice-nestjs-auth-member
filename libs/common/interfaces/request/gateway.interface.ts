import { HttpStatus } from '@nestjs/common';

export interface IGatewayResponse {
  statusCode: HttpStatus;
  data: Array<unknown> | unknown;
  message: string;
  errors: Array<unknown> | unknown;
}

export interface IGatewayError {
  errorCode: number;
  errorMessage: string | string[];
}
