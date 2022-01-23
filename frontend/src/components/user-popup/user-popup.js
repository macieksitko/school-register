import React, { useState } from "react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import "./user-popup.scss";
import TextBox from "devextreme-react/text-box";
import SelectBox from "devextreme-react/select-box";
import { STUDENT, TEACHER } from "../../utils/user-roles";
import userService from "../../api/user.service";
import notify from "devextreme/ui/notify";
import { LoadIndicator } from "devextreme-react/load-indicator";
import formatCaps from "../../utils/format-caps";

export default function UserPopup({ onClose, onSave }) {
  const roles = [TEACHER, STUDENT].map((r) => formatCaps(r));
  const [isLoading, setIsLoading] = useState(false);
  const [repeatedPassword, setRepeatedPassword] = useState("");
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

  const verifyForm = () => {
    const { name, lastName, email, role, password } = userData;

    if (name && lastName && email && role && password) {
      return true;
    } else {
      notify("Fill all fields!", "error", 2000);
      return false;
    }
  };

  const passwordsMatch = () => {
    const { password } = userData;
    if (!repeatedPassword || !password) {
      notify("Fill both password fields!", "error", 2000);
      return false;
    }

    if (repeatedPassword !== password) {
      notify("Provided passwords are not identical", "error", 2000);
      return false;
    }

    return true;
  };

  const saveButton = {
    icon: "check",
    text: "Save",
    onClick: async () => {
      if (verifyForm() && passwordsMatch()) {
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
      title={`Add new ${userData.role === "" ? "user" : formatCaps(userData.role)}`}
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
        <div className="dx-field">
          <div className="dx-field-label">Type of User</div>
          <div className="dx-field-value">
            <SelectBox
              items={roles}
              placeholder="Select role..."
              defaultValue={undefined}
              onValueChanged={({ value }) =>
                setUserData({ ...userData, role: value.toUpperCase() })
              }
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
              placeholder="Type mail, e.g. user@mail.com..."
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
              placeholder="Type at least 8 characters..."
              onValueChanged={({ value }) => setUserData({ ...userData, password: value })}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Repeated Password</div>
          <div className="dx-field-value">
            <TextBox
              value={repeatedPassword}
              placeholder="Repeat password..."
              onValueChanged={({ value }) => setRepeatedPassword(value)}
            />
          </div>
        </div>
      </div>
    </Popup>
  );
}
