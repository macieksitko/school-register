import React, { useState } from "react";
import "./profile.scss";
import Form from "devextreme-react/form";
import TokenService from "../../api/token.service";

export default function Profile() {
  const [notes, setNotes] = useState("Teacher");
  const employee = TokenService.getUser()?.user;

  return (
    <React.Fragment>
      <h2 className={"content-block"}>Profile</h2>
      <div className={"content-block dx-card responsive-paddings"}>
        <Form
          id={"form"}
          defaultFormData={employee}
          onFieldDataChanged={(e) => e.dataField === "Notes" && setNotes(e.value)}
          labelLocation={"top"}
          colCountByScreen={colCountByScreen}
        />
      </div>
    </React.Fragment>
  );
}

const colCountByScreen = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
};
