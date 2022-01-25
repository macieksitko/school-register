import React from "react";
import { Button } from "devextreme-react/button";
import "./add-students-button.scss";

const AddStudentsButton = ({ onClick }) => (
  <div className="cell">
    <Button className="button" icon="add" type="normal" stylingMode="outlined" onClick={onClick} />
  </div>
);

export default AddStudentsButton;
