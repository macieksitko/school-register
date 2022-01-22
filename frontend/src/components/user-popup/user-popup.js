import React, { useState } from "react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import { NumberBox } from "devextreme-react/number-box";
import RadioGroup from "devextreme-react/radio-group";
import TextArea from "devextreme-react/text-area";
import "./user-popup.scss";

export default function UserPopup({ isVisible, onClose, onSave }) {
  const defaultMark = { mark: 3, weight: 1, comment: "" };
  const [markData, setMarkData] = useState(defaultMark);

  const closeButton = {
    icon: "close",
    text: "Close",
    onClick: () => {
      onClose();
      setMarkData(defaultMark);
    },
  };

  const saveButton = {
    icon: "check",
    text: "Save",
    onClick: () => {
      onSave(markData);
      setMarkData(defaultMark);
    },
  };

  const tests = [
    { id: 0, text: "Activity" },
    { id: 1, text: "Test" },
    { id: 2, text: "Exam" },
  ];

  return (
    <Popup
      visible={isVisible}
      onHiding={onClose}
      dragEnabled={false}
      closeOnOutsideClick
      showCloseButton
      showTitle
      title="Add new user"
      container=".dx-viewport"
      className="popup"
      width={"35vw"}
    >
      <ToolbarItem widget="dxButton" toolbar="bottom" location="before" options={saveButton} />
      <ToolbarItem widget="dxButton" toolbar="bottom" location="after" options={closeButton} />
      <div className="form">
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Mark</div>
            <div className="dx-field-value">
              <NumberBox
                min={1}
                max={6}
                showSpinButtons
                defaultValue={3}
                value={markData.mark}
                onValueChanged={({ value }) => setMarkData({ ...markData, mark: value })}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Weight</div>
            <div className="dx-field-value">
              <RadioGroup
                value={markData.weight}
                items={tests}
                valueExpr="id"
                layout="horizontal"
                onValueChanged={({ value }) =>
                  setMarkData({ ...markData, weight: value.id ? value.id : value })
                }
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Comment</div>
            <div className="dx-field-value">
              <TextArea
                height={180}
                value={markData.comment}
                onValueChanged={({ value }) => setMarkData({ ...markData, comment: value })}
              />
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
