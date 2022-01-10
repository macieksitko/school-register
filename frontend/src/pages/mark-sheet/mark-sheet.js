import React, { useState } from "react";
import {
  grades,
  students as mockedStudents,
  subjects as mockedSubjects,
} from "../../static-data/data";
import MarkSheetGrid from "../../components/mark-sheet-grid/mark-sheet-grid";
import SelectBox from "devextreme-react/select-box";
import "./mark-sheet.scss";

export default function MarkSheet() {
  const [subjects, setSubjects] = useState(mockedSubjects.map((x) => x.name));
  const [students, setStudents] = useState(mockedStudents.map((x) => x.name));
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  return (
    <React.Fragment>
      <h2 className={"content-block"}>Mark-Sheet</h2>
      {/* <p>Select subject and student to display grades.</p> */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <SelectBox
          className="select"
          items={subjects}
          placeholder="Select subject..."
          onValueChanged={({ value }) => setSelectedSubject(value)}
          searchEnabled
        />
        <SelectBox
          items={students}
          placeholder="Select student..."
          onValueChanged={({ value }) => setSelectedStudent(value)}
          searchEnabled
          disabled={selectedSubject === ""}
        />
      </div>
      {selectedStudent !== "" && selectedSubject !== "" && <MarkSheetGrid grades={grades} />}
    </React.Fragment>
  );
}
