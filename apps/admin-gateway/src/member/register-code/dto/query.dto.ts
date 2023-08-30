import { RegisterCode } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import {
  IQueryMessage,
  OrderFields,
  QueryFields,
} from '@lib/common/interfaces';
import { Type } from 'class-transformer';
import { RegisterCodeType, Sort } from '@lib/common/enums';

export class QueryFieldsRegCodeDto implements QueryFields<RegisterCode> {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  memberId: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  recommendCode: string;

  @ApiProperty({ enum: RegisterCodeType, required: false })
  @IsOptional()
  @IsEnum(RegisterCodeType)
  type: RegisterCodeType;
}

export class OrderFieldsRegCodeDto implements OrderFields<RegisterCode> {
  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  id: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  createdAt: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  updatedAt: Sort;
}

export class QueryRegCodeDto implements IQueryMessage<RegisterCode> {
  @ApiProperty({ required: true, type: QueryFieldsRegCodeDto })
  @ValidateNested()
  @Type(() => QueryFieldsRegCodeDto)
  queryFields: QueryFieldsRegCodeDto;

  @ApiProperty({ required: true, type: OrderFieldsRegCodeDto })
  @ValidateNested()
  @Type(() => OrderFieldsRegCodeDto)
  orderFields: OrderFieldsRegCodeDto;
}
