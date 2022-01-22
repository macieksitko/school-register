import React from "react";
import "./mark-sheet-grid.scss";
import DataGrid, { Column } from "devextreme-react/data-grid";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const columns = ["Subject", "Term I", "Term II", "End of year grades"];

export default function MarkSheetGrid({ grades }) {
  return (
    <DataGrid
      dataSource={grades}
      keyExpr="_id"
      showColumnLines={true}
      showBorders={true}
      style={{ padding: 20 }}
    >
      <Column dataField="name" width={100} />
      <Column caption="Term I">
        <Column
          dataField="term1Grades"
          caption="Grades"
          cellRender={cellRenderTerm1}
          format="fixedPoint"
        />
        {/*<Column width={70} dataField="term1Avg" caption="Avg" />*/}
        <Column dataField="term1Grade" width={55} caption="I" />
      </Column>
      <Column caption="Term II">
        <Column dataField="term2Grades" caption="Grades" cellRender={cellRenderTerm2} />
        {/*<Column dataField="term2Avg" width={70} caption="Avg" />*/}
        <Column dataField="term2Grade" width={55} caption="II" />
      </Column>
      <Column caption="Final">
        {/*<Column dataField="finalAvg" caption="Avg" width={60} />*/}
        <Column dataField="finalGrade" caption="I" width={80} />
      </Column>
    </DataGrid>
  );
}

function cellRenderTerm1(data) {
  const renderTooltip = (props) => (
    <Tooltip className="tooltiptext" id="button-tooltip" {...props}>
      <div>Weight: {props.weight}</div>
      <div>Date: {props.creationDate}</div>
      <div>Comment: {props.comment}</div>
      <div>Teacher: {props.teacher}</div>
    </Tooltip>
  );

  return (
    <span>
      {data.data.term1Grades.map((el) => (
        <OverlayTrigger key={el._id} placement="top" overlay={renderTooltip(el)}>
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
      <div>Date: {props.creationDate}</div>
      <div>Comment: {props.comment}</div>
      <div>Teacher: {props.teacher}</div>
    </Tooltip>
  );

  return (
    <span>
      {data.data.term2Grades.map((el) => (
        <OverlayTrigger key={el._id} placement="top" overlay={renderTooltip(el)}>
          <span className="tooltip" weight={el.weight}>
            {el.grade}
          </span>
        </OverlayTrigger>
      ))}
    </span>
  );
}
