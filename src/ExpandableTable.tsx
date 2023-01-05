import React, { useEffect } from "react";
import { useState } from "react";
import ExpandableTableRow from "./ExpandableTableRow";
import { Column } from "./ExpandableTableColumn";
import "./expandableTable.css";

export interface CollapseEvent {
  timestamp: number;
  collapse: boolean | undefined;
}

interface Props {
  columns: Column[];
  data: { [key: string]: any }[];
  childDataKey?: string; //default is "child"
  rowKey?: string;
  rowColor?: (rowData: any) => string | undefined;
  visibleOnInit?: (rowData: any) => boolean;
  hideCollapseExpandButtons?: boolean;
  // sortData?: any;
}

const ExpandableTable: React.FC<Props> = ({
  columns,
  data,
  childDataKey,
  rowKey,
  rowColor,
  visibleOnInit,
  hideCollapseExpandButtons,
  // sortData
}) => {
  /** An "event" used to collapse or expand all rows in the table */
  const [collapseAllEvent, setCollapseAllEvent] = useState<CollapseEvent>({
    timestamp: 0,
    collapse: undefined
  });

  const [rowData, setRowData] = useState<any>(data);

  const rows = rowData.map((value:any) => {
    const rowKeyValue = () => {
      if (rowKey) {
        return value[rowKey];
      } else {
        return "0" + Object.values(value).join();
      }
    };
    return (
      <ExpandableTableRow
        key={rowKeyValue()}
        collapseAllEvent={collapseAllEvent}
        hideChildren={{
          timestamp: 0,
          collapse: undefined
        }}
        data={value}
        columns={columns}
        childDataKey={childDataKey || "child"}
        childLevel={0}
        rowKey={rowKey}
        rowColor={rowColor}
        visibleOnInit={visibleOnInit}
        expandParent={() => { }}
      ></ExpandableTableRow>
    );
  });
  const sortData = (key:any) => {
    const sorted = [...rowData].sort((a, b) => (a[key] > b[key] ? 1 : -1));
    setRowData(sorted);
  };
  const renderHeaders = () => {
    return columns?.map((column) => {
      return <th className="sortIcon" onClick={() => sortData(column.title)} key={column.title}>{column.title}<span className="sortIcons"></span></th>;
    });
  };

  let buttons;
  if (!hideCollapseExpandButtons) {
    buttons = (
      <div className={"expandCollapseAllRow"}>
        <button
          className={"expandCollapseAll"}
          onClick={(e) => {
            setCollapseAllEvent({ timestamp: e.timeStamp, collapse: false });
          }}
        >
          Expand All
        </button>
        <button
          className={"expandCollapseAll"}
          onClick={(e) => {
            setCollapseAllEvent({ timestamp: e.timeStamp, collapse: true });
          }}
        >
          Collapse All
        </button>
      </div>
    );
  }

  return (
    <>
      <div>{buttons}</div>
      <table>
        <thead>
          <tr>{renderHeaders()}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
};

export default ExpandableTable;
