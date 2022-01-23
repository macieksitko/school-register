import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import "./user-list.scss";
import UserPopup from "../../components/user-popup/user-popup";
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
import StudentSevice from "../../api/student.service";
import formatCaps from "../../utils/format-caps";

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
        showBorders
        style={{ padding: "0px 20px" }}
      >
        <Selection mode="multiple" />
        <GroupPanel visible={true} />
        <Column caption="First Name" dataField="name" width={250} />
        <Column caption="Last Name" dataField="lastName" width={250} />
        <Column caption="Mail" dataField="email" width={200} />
        <Column
          caption="Role"
          dataField="role"
          cellRender={({ value }) => (value ? formatCaps(value) : "")}
          width={100}
        />
        <Column
          caption="Subjects"
          dataField="subjects"
          cellRender={({ value }) => (value.length !== 0 ? value.map((x) => x.name) : "-")}
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
        <UserPopup
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
