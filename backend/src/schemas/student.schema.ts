import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Course } from './course.schema';
import { Mark } from './mark.schema';
import { Subject } from './subject.schema';
import { User } from './user.schema';
import { Role } from 'src/auth/roles/role.enum';

export type StudentDocument = Student & Document;

@Schema()
export class Student {
  @Prop({ required: true, type: Date })
  creationDate: Date;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: String, enum: Role })
  role: Role;

  @Prop({ required: true })
  lastName: string;

  //Relations

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  account: User | string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    ref: 'Subject',
  })
  subjects?: Subject[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    ref: 'Course',
  })
  courses?: Course[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    ref: 'Mark',
  })
  marks?: Mark[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
