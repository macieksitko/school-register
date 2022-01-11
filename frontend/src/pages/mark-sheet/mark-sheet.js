import React, { useState } from "react";
import {
  grades,
  students as mockedStudents,
  subjects as mockedSubjects,
} from "../../static-data/data";
import MarkSheetGrid from "../../components/mark-sheet-grid/mark-sheet-grid";
import SelectBox from "devextreme-react/select-box";
import { Button } from "devextreme-react/button";
import "./mark-sheet.scss";
import MarkPopup from "../../components/mark-popup/mark-popup";

export default function MarkSheet() {
  const [subjects, setSubjects] = useState(mockedSubjects.map((x) => x.name));
  const [students, setStudents] = useState(mockedStudents.map((x) => x.name));
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const allSelected = selectedStudent !== "" && selectedSubject !== "";

  return (
    <React.Fragment>
      <div className="header">
        <h2 className={"content-block"}>Mark-Sheet</h2>
        <Button
          text="Add mark"
          disabled={!allSelected}
          type="normal"
          className="content-block"
          onClick={() => setIsPopupVisible(true)}
        />
      </div>
      <div className="selectContainer">
        <SelectBox
          className="select"
          items={subjects}
          placeholder="Select subject..."
          onValueChanged={({ value }) => setSelectedSubject(value)}
          searchEnabled
        />
        <SelectBox
          className="select"
          items={students}
          placeholder="Select student..."
          onValueChanged={({ value }) => setSelectedStudent(value)}
          searchEnabled
          disabled={selectedSubject === ""}
        />
      </div>
      {allSelected && <MarkSheetGrid grades={grades} />}
      <MarkPopup
        studentName={selectedStudent}
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
