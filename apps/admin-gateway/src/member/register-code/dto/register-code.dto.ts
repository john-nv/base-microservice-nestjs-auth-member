import { RegisterCodeType } from '@lib/common/enums';
import { IRegisterCode } from '@lib/common/interfaces/modules/register-code';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import * as moment from 'moment';

export class RegisterCodeDto implements IRegisterCode {
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  bonus: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  recommendCode: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  memberId: string;

  @ApiProperty({ enum: RegisterCodeType })
  @IsOptional()
  @IsEnum(RegisterCodeType)
  type: RegisterCodeType;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  detail: string;

  @ApiProperty({ required: false, default: moment().utc().toISOString() })
  @IsOptional()
  @IsDateString()
  registrationDate: Date;
}

export class UpdateRegisterCodeDto extends RegisterCodeDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  id: string;
}
