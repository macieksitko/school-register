import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Course, Teacher } from 'src/schemas';

export type SubjectDocument = Subject & Document;
@Schema()
export class Subject {
  @Prop({ required: true, type: Date })
  creationDate: Date;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: string;

  @Prop({ required: true })
  name: string;

  //Relations

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Course',
  })
  course?: Course;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    ref: 'Teacher',
  })
  teachers?: Teacher[];
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
