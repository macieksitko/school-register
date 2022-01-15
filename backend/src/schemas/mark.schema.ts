import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { MarkType } from 'src/common/enums';
import { Student, Subject, Teacher, TeacherSchema } from '.';

export type MarkDocument = Mark & Document;

@Schema()
export class Mark {
  @Prop({ required: true, type: Date })
  creationDate: Date;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string;

  @Prop({ required: false })
  comment?: string;

  @Prop({ type: Number })
  grade: string;

  @Prop({ type: String, enum: MarkType })
  markType: MarkType;

  @Prop({})
  weight: number;

  @Prop({})
  termNumber: number;

  //Relations

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' })
  teacher: Teacher;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' })
  subject?: Subject;
}

export const MarkSchema = SchemaFactory.createForClass(Mark);
