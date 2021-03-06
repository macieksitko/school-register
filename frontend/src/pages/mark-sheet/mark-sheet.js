import React, {useEffect, useState} from "react";
import MarkSheetGrid from "../../components/mark-sheet-grid/mark-sheet-grid";
import SelectBox from "devextreme-react/select-box";
import { Button } from "devextreme-react/button";
import "./mark-sheet.scss";
import MarkPopup from "../../components/mark-popup/mark-popup";
import TeacherSevice from "../../api/teacher.service";
import TokenService from "../../api/token.service";
import StudentService from "../../api/student.service";
import SubjectService from "../../api/subject.service";
import {MarkTypes} from "../../enums/markTypes";
import notify from "devextreme/ui/notify";

import api from '../../api/api';

export default function MarkSheet() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsWithMarks, setStudentsWithMarks] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [reload, setReload] = useState(false);
  const [reportDetails, setReportDetails] = useState({});
  const [isReportLoading, setIsReportLoading] = useState(false);

  const allSelected = selectedSubject !== "";

  useEffect(() => {
      const fetchData = async () => {
          TeacherSevice.getTeacherSubjects(TokenService.getUserId()).then(({ data })  => {
              console.log(data);
              setSubjects(data);
          }).catch((err) => {
              notify("Something went wrong", "error", 2000);
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
        }).catch((err) => {
            notify("Something went wrong", "error", 2000);
        });
    }

    function addMark(data) {
        data.subjectId = selectedSubject;
        StudentService.addStudentMark(data.selectedStudent, data).then(() => {
            notify("Grade added", "success", 2500);
            fetchStudentData(selectedSubject);
        }).catch((err) => {
            notify("Something went wrong", "error", 2000);
        });
    }

    const generateReport = async () =>{
      try {
        setIsReportLoading(true);
        const response = await SubjectService.generateReport(selectedSubject);
        notify(`Report is ready for being downloaded, generation time ${response.data.executionTime}`);
        setReportDetails(response.data);
      }catch(error){
        notify(`Something went wrong`, "error", 2000);
      } finally{
        setIsReportLoading(false);
      }
    };

    const downloadReport = async () => {
      try {
        const response = await api.post(`/api/reports/download`,  { reportPath: reportDetails.reportPath }, {
          headers: {'Content-Type': 'application/json'},
          responseType: "blob", 
        })

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          reportDetails.reportPath.split('/').pop()
        );
        document.body.appendChild(link);
        link.click();  
        link.parentNode.removeChild(link);
        setReportDetails({});
      }catch(error) {
        notify(`Something went wrong`, "error", 2000);
      }
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
        {
          !!Object.keys(reportDetails).length ? ( <Button
          text="Download report"
          type="normal"
          icon="download"
          className="content-block"
          onClick={() => downloadReport()}
          />
          ): (
            <Button
            text={isReportLoading ? 'Generating report...' : 'Generate report'}
            disabled={!allSelected}
            type="normal"
            icon="download"
            className="content-block"
            onClick={() => generateReport()}
          />
          )
        }      
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
            addMark(data);
            setIsPopupVisible(false);
        }}
      />
    </React.Fragment>
  );
}
