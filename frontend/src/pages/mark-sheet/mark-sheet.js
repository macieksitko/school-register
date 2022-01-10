import React from "react";
import "./mark-sheet.scss";
import DataGrid, { Column } from "devextreme-react/data-grid";
import { grades } from "../../static-data/data";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const columns = ["Subject", "Term I", "Term II", "End of year grades"];

export default function MarkSheet() {
  return (
    <React.Fragment>
      <h2 className={"content-block"}>Mark-Sheet</h2>
      <DataGrid dataSource={grades} keyExpr="ID" showColumnLines={true} showBorders={true}>
        <Column dataField="subject" width={100} />
        <Column caption="Term I">
          <Column
            dataField="term1Grades"
            caption="Grades"
            cellRender={cellRenderTerm1}
            format="fixedPoint"
          />
          <Column width={70} dataField="term1Avg" caption="Avg" />
          <Column dataField="term1Grade" width={55} caption="I" />
        </Column>
        <Column caption="Term II">
          <Column dataField="term1Grades" caption="Grades" cellRender={cellRenderTerm2} />
          <Column dataField="term2Avg" width={70} caption="Avg" />
          <Column dataField="term2Grade" width={55} caption="II" />
        </Column>
        <Column caption="Final">
          <Column dataField="finalAvg" caption="Avg" width={60} />
          <Column dataField="finalGrade" caption="I" width={60} />
        </Column>
      </DataGrid>
    </React.Fragment>
  );
}

function cellRenderTerm1(data) {
  const renderTooltip = (props) => (
    <Tooltip className="tooltiptext" id="button-tooltip" {...props}>
      <div>Weight: {props.weight}</div>
      <div>Date: {props.date}</div>
      <div>Comment: {props.comment}</div>
      <div>Teacher: {props.teacher}</div>
    </Tooltip>
  );

  return (
    <span>
      {data.data.term1Grades.map((el) => (
        <OverlayTrigger placement="top" overlay={renderTooltip(el)}>
          <span className="tooltip" weight={el.weight}>
            {el.grade}
          </span>
        </OverlayTrigger>
      ))}
    </span>
  );
}

function cellRenderTerm2(data) {
  const renderTooltip = (props) => (
    <Tooltip className="tooltiptext" id="button-tooltip" {...props}>
      <div>Weight: {props.weight}</div>
      <div>Date: {props.date}</div>
      <div>Comment: {props.comment}</div>
      <div>Teacher: {props.teacher}</div>
    </Tooltip>
  );

  return (
    <span>
      {data.data.term2Grades.map((el) => (
        <OverlayTrigger placement="top" overlay={renderTooltip(el)}>
          <span className="tooltip" weight={el.weight}>
            {el.grade}
          </span>
        </OverlayTrigger>
      ))}
    </span>
  );
}
