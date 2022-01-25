import React, { useState } from "react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import { NumberBox } from "devextreme-react/number-box";
import RadioGroup from "devextreme-react/radio-group";
import TextArea from "devextreme-react/text-area";
import "./mark-popup.scss";
import SelectBox from "devextreme-react/select-box";

export default function MarkPopup({ isVisible, onClose, onSave, students }) {
  const defaultMark = { mark: 3, weight: 1, comment: "", termNumber: 1, markType: "UNIT", selectedStudent: "" };
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

  const terms = [
    { id: 1, text: "Term 1"},
    { id: 2, text: "Term 2"},
  ]

  const markTypes = [
    { id: "UNIT", text: "Unit"},
    { id: "TERM1", text: "Term 1"},
    { id: "TERM2", text: "Term 2"},
    { id: "FINAL", text: "Final"},
  ]

  return (
    <Popup
      visible={isVisible}
      onHiding={onClose}
      dragEnabled={true}
      closeOnOutsideClick
      showCloseButton
      showTitle
      title="Add new mark"
      container=".dx-viewport"
      className="popup"
      width={"800px"}
    >
      <ToolbarItem widget="dxButton" toolbar="bottom" location="before" options={saveButton} />
      <ToolbarItem widget="dxButton" toolbar="bottom" location="after" options={closeButton} />
      <div className="form">
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Student's name</div>

            <div className="dx-field-value">
              <SelectBox
                className="select"
                items={students}
                valueExpr="_id"
                displayExpr="name"
                placeholder="Select student..."
                onValueChanged={({ value }) => setMarkData({ ...markData, selectedStudent: value })}
                searchEnabled
              />
            </div>
          </div>
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
            <div className="dx-field-label">Term</div>
            <div className="dx-field-value">
              <RadioGroup
                  value={markData.termNumber}
                  items={terms}
                  valueExpr="id"
                  layout="horizontal"
                  onValueChanged={({ value }) =>
                      setMarkData({ ...markData, termNumber: value.id ? value.id : value })
                  }
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Mark Type</div>
            <div className="dx-field-value">
              <RadioGroup
                  value={markData.markType}
                  items={markTypes}
                  valueExpr="id"
                  layout="horizontal"
                  onValueChanged={({ value }) =>
                      setMarkData({ ...markData, markType: value.id ? value.id : value })
                  }
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Comment</div>
            <div className="dx-field-value">
              <TextArea
                height={60}
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
