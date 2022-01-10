import React from "react";
import { grades } from "../../static-data/data";
import MarkSheetGrid from "../../components/mark-sheet-grid/mark-sheet-grid";

export default function MarkSheet() {
  return (
    <React.Fragment>
      <h2 className={"content-block"}>Mark-Sheet</h2>
      <MarkSheetGrid grades={grades} />
    </React.Fragment>
  );
}
