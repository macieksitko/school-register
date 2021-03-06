import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import "./user-list.scss";
import AddUserPopup from "../../components/add-user-popup/add-user-popup";
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
import StudentSevice from "../../api/student.service";
import formatCaps from "../../utils/format-caps";
import UserSubjectList from "./user-subject-list";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const t = TeacherSevice.getTeachers();
      const s = StudentSevice.getStudents();

      setIsLoading(true);
      Promise.all([t, s])
        .then((responses) => {
          setUsers(responses.map((r) => r.data).flat(1));
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
  }, [reload]);

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
          text="Add new user"
          type="normal"
          icon="add"
          className="content-block"
          onClick={() => setIsPopupVisible(true)}
        />
      </div>
      <DataGrid
        className="datagrid"
        id="gridContainer"
        dataSource={users}
        keyExpr="_id"
        showBorders
        style={{ padding: "0px 20px" }}
      >
        <Selection mode="multiple" />
        <ColumnFixing enabled={true} />
        <GroupPanel visible={true} />
        <Column caption="First Name" dataField="name" />
        <Column caption="Last Name" dataField="lastName" />
        <Column caption="Mail" dataField="email" />
        <Column
          caption="Role"
          dataField="role"
          cellRender={({ value }) => (value ? formatCaps(value) : "")}
          width={100}
        />
        <Column
          caption="Subjects"
          dataField="subjects"
          cellRender={({ value }) => <UserSubjectList cells={value} />}
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
        <AddUserPopup
          key={reload ? 1 : 0}
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
