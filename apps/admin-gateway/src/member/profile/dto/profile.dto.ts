import { Member } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import {
  IQueryMessage,
  OrderFields,
  QueryFields,
} from '@lib/common/interfaces';
import { Type } from 'class-transformer';
import { Sort } from '@lib/common/enums';

export class QueryFieldsProfileDto implements QueryFields<Member> {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  username: string;
}

export class OrderFieldsProfileDto implements OrderFields<Member> {
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

export class QueryProfileDto implements IQueryMessage<Member> {
  @ApiProperty({ required: true, type: QueryFieldsProfileDto })
  @ValidateNested()
  @Type(() => QueryFieldsProfileDto)
  queryFields: QueryFieldsProfileDto;

  @ApiProperty({ required: true, type: OrderFieldsProfileDto })
  @ValidateNested()
  @Type(() => OrderFieldsProfileDto)
  orderFields: OrderFieldsProfileDto;
}
