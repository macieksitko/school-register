import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import "./user-list.scss";
import UserPopup from "../../components/user-popup/user-popup";
import DataGrid, { Column, Export, Selection, GroupPanel } from "devextreme-react/data-grid";
import notify from "devextreme/ui/notify";
import { LoadIndicator } from "devextreme-react/load-indicator";
import TeacherSevice from "../../api/teacher.service";
import StudentSevice from "../../api/student.service";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const t = TeacherSevice.getTeachers();
      const s = StudentSevice.getStudents();

      setIsLoading(true);
      Promise.all([t, s])
        .then((responses) => {
          const data = responses.map((r) => r.data).flat(1);
          console.log("data", data);
          setUsers(data);
        })
        .catch((err) => {
          notify(err?.message || "Unable to download users", "error", 2000);
          setUsers([]);
        })
        .finally(() => {
          setIsLoading(false);
          console.log("users", users);
        });
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <div className="header">
        <h2 className={"content-block"}>
          User list
          {isLoading && (
            <LoadIndicator id="small-indicator" height={20} width={20} style={{ marginLeft: 10 }} />
          )}
        </h2>
        <Button
          text="Add user"
          type="normal"
          className="content-block"
          onClick={() => setIsPopupVisible(true)}
        />
      </div>
      <DataGrid
        id="gridContainer"
        dataSource={users}
        keyExpr="_id"
        showBorders={true}
        style={{ padding: 20 }}
      >
        <Selection mode="multiple" />
        <GroupPanel visible={true} />
        <Column caption="First Name" dataField="name" />
        <Column caption="Last Name" dataField="lastName" />
        <Column caption="Mail" dataField="email" />
        <Column caption="Role" dataField="role" />
        <Column
          caption="Subjects"
          dataField="subjects"
          cellRender={({ value }) => (value.length !== 0 ? value : "empty")}
        />
        <Export enabled={true} allowExportSelectedData={true} />
      </DataGrid>
      <UserPopup
        studentName={""}
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
