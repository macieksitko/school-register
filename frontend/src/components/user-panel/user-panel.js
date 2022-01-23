import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import ContextMenu, { Position } from "devextreme-react/context-menu";
import List from "devextreme-react/list";
import { useAuth } from "../../contexts/auth";
import "./user-panel.scss";
import { PROFILE } from "../../utils/pages-routes";
import formatCaps from "../../utils/format-caps";

export default function UserPanel({ menuMode }) {
  const { user, signOut } = useAuth();
  const history = useHistory();

  function navigateToProfile() {
    history.push(PROFILE);
  }
  const menuItems = useMemo(
    () => [
      {
        text: "Profile",
        icon: "user",
        onClick: navigateToProfile,
      },
      {
        text: "Logout",
        icon: "runner",
        onClick: signOut,
      },
    ],
    [signOut]
  );

  const {
    user: { name, lastName, role },
  } = user;

  return (
    <div className={"user-panel"}>
      <div className={"user-info"}>
        <div className={"image-container"}></div>
        <div className={"user-name"}>{`${name} ${lastName} (${formatCaps(role)})`}</div>
      </div>

      {menuMode === "context" && (
        <ContextMenu
          items={menuItems}
          target={".user-button"}
          showEvent={"dxclick"}
          width={210}
          cssClass={"user-menu"}
        >
          <Position my={"top center"} at={"bottom center"} />
        </ContextMenu>
      )}
      {menuMode === "list" && <List className={"dx-toolbar-menu-action"} items={menuItems} />}
    </div>
  );
}
