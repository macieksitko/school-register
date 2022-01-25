import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import "./subject-list.scss";
import DataGrid, {
  Column,
  Export,
  Selection,
  Pager,
  Paging,
  GroupPanel,
  ColumnFixing,
} from "devextreme-react/data-grid";
import notify from "devextreme/ui/notify";
import { LoadIndicator } from "devextreme-react/load-indicator";
import TeacherSevice from "../../api/teacher.service";
import SubjectService from "../../api/subject.service";
import AddSubjectPopup from "../../components/add-subject-popup/add-subject-popup";
import TeachersList from "./teachers-list";
import AddStudentsButton from "./add-students-button/add-students-button";
import AddStudentsPopup from "../../components/add-students-popup/add-students-popup";
import studentService from "../../api/student.service";

export default function SubjectList() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [isSubjectPopupVisible, setIsSubjectPopupVisible] = useState(false);
  const [isStudentsPopupVisible, setIsStudentsPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [subjectId, setSubjectId] = useState("");

  const mapUserAccount = ({ _id, name, lastName, email }) => ({
    _id,
    description: `${name} ${lastName} (${email})`,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      TeacherSevice.getTeachers()
        .then(({ data }) => setTeachers(data.map(mapUserAccount)))
        .catch((err) => {
          notify(err?.message || "Unable to download teachers", "error", 2000);
          setTeachers([]);
        })
        .then(() =>
          SubjectService.getSubjects()
            .then(({ data }) => setSubjects(data))
            .catch((err) => {
              notify(err?.message || "Unable to download subjects", "error", 2000);
              setSubjects([]);
            })
        )
        .then(() =>
          studentService
            .getStudents()
            .then(({ data }) => setStudents(data.map(mapUserAccount)))
            .catch((err) => {
              notify(err?.message || "Unable to download students", "error", 2000);
              setStudents([]);
            })
        )
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchData();
  }, [reload]);

  return (
    <React.Fragment>
      <div className="header">
        <h2 className={"content-block"}>
          Subject list
          {isLoading && (
            <LoadIndicator id="small-indicator" height={20} width={20} style={{ marginLeft: 10 }} />
          )}
        </h2>
        <Button
          text="Add new subject"
          type="normal"
          className="content-block"
          icon="add"
          onClick={() => setIsSubjectPopupVisible(true)}
        />
      </div>
      <DataGrid
        className="datagrid"
        id="gridContainer"
        dataSource={subjects}
        keyExpr="_id"
        showBorders
        style={{ padding: "0px 20px" }}
      >
        <ColumnFixing enabled={true} />
        <Selection mode="multiple" />
        <GroupPanel visible={true} />
        <Column caption="Subject Name" dataField="name" />
        <Column
          caption="Creation Date"
          dataField="creationDate"
          width={150}
          cellRender={({ value }) => new Date(value).toDateString()}
        />
        <Column
          caption="Teachers"
          dataField="teachers"
          cellRender={({ value }) => <TeachersList cells={value} teachers={teachers} />}
        />
        <Column
          caption="Add Students"
          dataField="_id"
          width={120}
          cellRender={({ value }) => (
            <AddStudentsButton
              onClick={() => {
                setSubjectId(value);
                setIsStudentsPopupVisible(true);
              }}
            />
          )}
        />
        <Export enabled={true} allowExportSelectedData={true} />
        <Pager
          allowedPageSizes={[5, 10, 25, 50]}
          visible={true}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />
        <Paging defaultPageSize={5} />
      </DataGrid>
      {isSubjectPopupVisible && (
        <AddSubjectPopup
          teachers={teachers}
          onClose={() => setIsSubjectPopupVisible(false)}
          onSave={() => {
            setReload(!reload);
            setIsSubjectPopupVisible(false);
          }}
        />
      )}
      {isStudentsPopupVisible && subjectId && (
        <AddStudentsPopup
          students={students}
          subjectId={subjectId}
          onSave={() => {
            setReload(!reload);
            setIsStudentsPopupVisible(false);
          }}
          onClose={() => setIsStudentsPopupVisible(false)}
        />
      )}
    </React.Fragment>
  );
}
