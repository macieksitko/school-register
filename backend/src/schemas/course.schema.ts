import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Subject } from './subject.schema';

export type CourseDocument = Course & Document;
@Schema()
export class Course {
  @Prop({ required: true, type: Date })
  creationDate: Date;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  isArchive?: boolean;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    ref: 'Subject',
  })
  subjects?: Subject[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
