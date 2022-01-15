import { MarkType } from 'src/common/enums';

export class AddStudentMarkDto {
  comment?: string;

  grade: string;

  markType: MarkType;

  weight: number;

  termNumber: number;

  teacherId: string;

  subjectId: string;
}
