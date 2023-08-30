import { RegisterCodeType } from '@lib/common/enums';

export interface IRegisterCode {
  id?: string;
  bonus: number;
  recommendCode: string;
  type: RegisterCodeType;
  detail?: string;
  memberId: string;
}
