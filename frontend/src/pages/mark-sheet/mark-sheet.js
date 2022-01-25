import React, {useEffect, useState} from "react";
import MarkSheetGrid from "../../components/mark-sheet-grid/mark-sheet-grid";
import SelectBox from "devextreme-react/select-box";
import { Button } from "devextreme-react/button";
import "./mark-sheet.scss";
import MarkPopup from "../../components/mark-popup/mark-popup";
import TeacherSevice from "../../api/teacher.service";
import TokenService from "../../api/token.service";
import SubjectService from "../../api/subject.service";
import {MarkTypes} from "../../enums/markTypes";

export default function MarkSheet() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsWithMarks, setStudentsWithMarks] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [reload, setReload] = useState(false);

  const allSelected = selectedSubject !== "";

  useEffect(() => {
      const fetchData = async () => {
          TeacherSevice.getTeacherSubjects(TokenService.getUserId()).then(({ data })  => {
              console.log(data);
              setSubjects(data);
          });
      };

      fetchData();
  }, [reload]);

    function fetchStudentData(subjectId) {
        setSelectedSubject(subjectId);
        SubjectService.getSubjectsStudent(subjectId).then((response) => {
            console.log(response);
            let studentsWithMarks = [];
            let studentsForSelect = response.data.map((x) => {
                return {_id: x._id, name: x.name, lastName: x.lastName};
            });
            setStudents(studentsForSelect);
            for (let stud of response.data) {
                let newStudent = {};
                newStudent.name = stud.name + " " + stud.lastName;
                newStudent._id = stud._id;
                newStudent.term1Grades = stud.marks.filter((mark) => { return (mark.markType === MarkTypes.UNIT) && (mark.termNumber === 1) && (mark.subject === subjectId); });
                newStudent.term2Grades = stud.marks.filter((mark) => { return (mark.markType === MarkTypes.UNIT) && (mark.termNumber === 2) && (mark.subject === subjectId); });

                newStudent.term1Grade = stud.marks.filter((mark) => { return (mark.markType === MarkTypes.TERM1) && (mark.subject === subjectId); })[0]?.grade;
                // TODO maybe: newStudent.term1Avg = ;

                newStudent.term2Grade = stud.marks.filter((mark) => { return (mark.markType === MarkTypes.TERM2) && (mark.subject === subjectId); })[0]?.grade;
                // TODO maybe: newStudent.term2Avg = ;

                // TODO maybe: newStudent.finalAvg = ;
                newStudent.finalGrade = stud.marks.filter((mark) => { return (mark.markType === MarkTypes.FINAL) && (mark.subject === subjectId); })[0]?.grade;
                studentsWithMarks.push(newStudent);
            }
            setStudentsWithMarks(studentsWithMarks);
        });
    }

    return (
    <React.Fragment>
      <div className="header">
        <h2 className={"content-block"}>Mark-Sheet</h2>
        <Button
          text="Add new mark"
          disabled={!allSelected}
          type="normal"
          icon="add"
          className="content-block"
          onClick={() => setIsPopupVisible(true)}
        />
      </div>
      <div className="selectContainer">
        <SelectBox
          className="select"
          items={subjects}
          valueExpr="_id"
          displayExpr="name"
          placeholder="Select subject..."
          onValueChanged={({ value }) => fetchStudentData(value)}
          searchEnabled
        />
      </div>
      {allSelected && <MarkSheetGrid grades={studentsWithMarks} />}
      <MarkPopup
        students={students}
        isVisible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        onSave={(data) => {
          window.alert(JSON.stringify(data));
          setIsPopupVisible(false);
        }}
      />
    </React.Fragment>
  );
}
