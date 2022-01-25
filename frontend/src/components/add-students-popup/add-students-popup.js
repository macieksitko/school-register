import React, { useState } from "react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import notify from "devextreme/ui/notify";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { List } from "devextreme-react/list";
import "./add-students-popup.scss";

export default function AddStudentsPopup({ subjectId, students, onClose, onSave }) {
  const [isLoading, setIsLoading] = useState(false);
  const [subjectData, setData] = useState({
    studentsIds: [],
  });
  const [selected, setSelected] = useState([]);

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
      const body = {
        name: subjectData.name,
        teacherIds: selected.map((x) => x._id),
        courseId: subjectData.courseId,
      };

      //TODO: OBSŁUGA API
      // const errors = await subjectService.addSubject(body);
      // if (Array.isArray(errors)) {
      //   notify(`${errors.join(". ")}`, "error", 2000);
      //   setIsLoading(false);
      // } else {
      //   setIsLoading(false);
      //   notify(`Subject ${subjectData.name} added!`, "success", 2000);
      //   onSave();
      // }
    },
  };

  return (
    <Popup
      visible
      onHiding={onClose}
      dragEnabled={true}
      closeOnOutsideClick
      showCloseButton
      title="Assign students"
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
            <div className="dx-field-label">List of Students to select</div>
            <div className="dx-field-value">
              <List
                className="studentslist"
                itemRender={(data) => data?.description}
                selectionMode="multiple"
                dataSource={students}
                onItemClick={({ itemData: item }) => {
                  if (selected.includes(item)) {
                    //removing if clicked item is present in array
                    setSelected([...selected.filter((x) => x._id !== item._id)]);
                  } else {
                    //adding if clicked item is not present in array
                    setSelected([...selected, item]);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
