import React, { useState } from "react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import "./user-popup.scss";
import TextBox from "devextreme-react/text-box";
import SelectBox from "devextreme-react/select-box";

import userRoles from "../../utils/user-roles";

import userService from "../../api/user.service";
import notify from "devextreme/ui/notify";
import { LoadIndicator } from "devextreme-react/load-indicator";
import formatCaps from "../../utils/format-caps";

export default function UserPopup({ onClose, onSave }) {
  const roles = [userRoles.teacher, userRoles.student];
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    username: "",
  });

  const closeButton = {
    icon: "close",
    text: "Close",
    onClick: onClose,
  };

  const saveButton = {
    icon: "check",
    text: "Save",
    onClick: async () => {
      setIsLoading(true);
      const errors = await userService.addUser(userData);
      if (Array.isArray(errors)) {
        notify(`${errors.join(". ")}`, "error", 2000);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        notify(
          `${formatCaps(userData.role)} ${userData.name} ${userData.lastName} added!`,
          "success",
          2000
        );
        onSave();
      }
    },
  };

  return (
    <Popup
      visible
      onHiding={onClose}
      dragEnabled={true}
      closeOnOutsideClick
      showCloseButton
      title={`Add new ${userData.role === "" ? "user" : userData.role.toLowerCase()}`}
      container=".dx-viewport"
      className="popup"
      width={"35vw"}
    >
      <ToolbarItem location="before">
        {isLoading && (
          <LoadIndicator id="small-indicator" height={20} width={20} style={{ marginLeft: 10 }} />
        )}
      </ToolbarItem>
      <ToolbarItem widget="dxButton" toolbar="bottom" location="before" options={saveButton} />
      <ToolbarItem widget="dxButton" toolbar="bottom" location="after" options={closeButton} />
      <div className="form">
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">User type</div>
            <div className="dx-field-value">
              <SelectBox
                items={roles}
                defaultValue={undefined}
                onValueChanged={({ value }) => setUserData({ ...userData, role: value })}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">First Name</div>
            <div className="dx-field-value">
              <TextBox
                value={userData.name}
                onValueChanged={({ value }) => setUserData({ ...userData, name: value })}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Last Name</div>
            <div className="dx-field-value">
              <TextBox
                value={userData.lastName}
                onValueChanged={({ value }) => setUserData({ ...userData, lastName: value })}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Mail</div>
            <div className="dx-field-value">
              <TextBox
                value={userData.email}
                onValueChanged={({ value }) =>
                  setUserData({
                    ...userData,
                    email: value,
                    username: value.slice(0, value.indexOf("@")),
                  })
                }
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Password</div>
            <div className="dx-field-value">
              <TextBox
                value={userData.password}
                onValueChanged={({ value }) => setUserData({ ...userData, password: value })}
              />
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
