import { Prop, Schema } from '@nestjs/mongoose';
import * as randomatic from 'randomatic';

@Schema()
export class BaseSchemaLess {
  @Prop({ type: String, default: () => randomatic('Aa0', 20) })
  id?: string;

  @Prop({ default: null })
  deletedAt?: Date;
}
