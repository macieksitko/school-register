import * as mongoose from 'mongoose';
import { MarkType } from '../enums';

export interface CurrentAccount {
  userId: mongoose.Types.ObjectId;
  username: string;
  name: string;
  lastName: string;
  role: MarkType;
  email: string;
}
