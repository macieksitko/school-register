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
} from "devextreme-react/data-grid";
import notify from "devextreme/ui/notify";
import { LoadIndicator } from "devextreme-react/load-indicator";
import TeacherSevice from "../../api/teacher.service";
import SubjectService from "../../api/subject.service";
import SubjectPopup from "../../components/subject-popup/subject-popup";
import TeachersList from "./teachers-list";

export default function SubjectList() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      TeacherSevice.getTeachers()
        .then(({ data }) => {
          const mappedTeachers = data.map(({ _id, name, lastName, email }) => ({
            _id,
            description: `${name} ${lastName} (${email})`,
          }));
          setTeachers(mappedTeachers);
        })
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
          onClick={() => setIsPopupVisible(true)}
        />
      </div>
      <DataGrid
        id="gridContainer"
        dataSource={subjects}
        keyExpr="_id"
        showBorders
        style={{ padding: "0px 20px" }}
      >
        <Selection mode="multiple" />
        <GroupPanel visible={true} />
        <Column caption="Subject Name" dataField="name" width={300} />
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
        <Export enabled={true} allowExportSelectedData={true} />
        <Pager
          allowedPageSizes={[5, 10, 25, 50]}
          visible={true}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />
        <Paging defaultPageSize={5} />
      </DataGrid>
      {isPopupVisible && (
        <SubjectPopup
          key={reload ? 1 : 0}
          teachers={teachers}
          isVisible={isPopupVisible}
          onClose={() => setIsPopupVisible(false)}
          onSave={() => {
            setReload(!reload);
            setIsPopupVisible(false);
          }}
        />
      )}
    </React.Fragment>
  );
}
