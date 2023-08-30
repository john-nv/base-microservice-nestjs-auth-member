import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class MultipleDeleteDto {
  @ApiProperty({ required: true, isArray: true, type: String })
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
