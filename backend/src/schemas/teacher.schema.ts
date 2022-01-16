import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from 'src/auth/roles/role.enum';
import { Subject, User } from 'src/schemas';

export type TeacherDocument = Teacher & Document;

@Schema()
export class Teacher {
  @Prop({ required: true, type: Date })
  creationDate: Date;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, type: String, enum: Role })
  role: Role;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  //Relations

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  account: User;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    ref: 'Subject',
  })
  subjects?: Subject[];
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
