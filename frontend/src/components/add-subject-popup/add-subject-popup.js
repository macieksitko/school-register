import React, { useState } from "react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import TextBox from "devextreme-react/text-box";
import DropDownBox from "devextreme-react/drop-down-box";
import notify from "devextreme/ui/notify";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { List } from "devextreme-react/list";
import subjectService from "../../api/subject.service";
import "./add-subject-popup.scss";

export default function AddSubjectPopup({ teachers, onClose, onSave }) {
  const [isLoading, setIsLoading] = useState(false);
  const [subjectData, setSubjectData] = useState({
    name: "",
    teacherIds: [],
  });
  const [selected, setSelected] = useState([]);

  const closeButton = {
    icon: "close",
    text: "Close",
    onClick: onClose,
  };

  const verifyForm = () => {
    const { name } = subjectData;

    if (name) {
      return true;
    } else {
      notify("Fill name of the subject!", "error", 2000);
      return false;
    }
  };

  const saveButton = {
    icon: "check",
    text: "Save",
    onClick: async () => {
      if (verifyForm()) {
        setIsLoading(true);
        const body = {
          name: subjectData.name,
          teacherIds: selected.map((x) => x._id),
          courseId: subjectData.courseId,
        };

        const errors = await subjectService.addSubject(body);
        if (Array.isArray(errors)) {
          notify(`${errors.join(". ")}`, "error", 2000);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          notify(`Subject ${subjectData.name} added!`, "success", 2000);
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
      title="Add new subject"
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
            <div className="dx-field-label">Subject Name</div>
            <div className="dx-field-value">
              <TextBox
                value={subjectData.name}
                onValueChanged={({ value }) => setSubjectData({ ...subjectData, name: value })}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Teachers</div>
            <div className="dx-field-value">
              <DropDownBox
                keyExpr="_id"
                displayExpr="description"
                dataSource={teachers}
                selection={true}
                placeholder="Assign teachers..."
                value={selected}
              >
                <List
                  itemRender={(data) => data?.description}
                  selectionMode="multiple"
                  dataSource={teachers}
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
              </DropDownBox>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
