import React, { useEffect, useMemo, useState } from "react";
import { Divider, Radio, Table } from "antd";
import { Excel } from "antd-table-saveas-excel";
import Loading from "../LoadingComponent/Loading";
import { BiSolidUserAccount } from "react-icons/bi";
import TopAdmin from "../TopAdmin";
const TableComponent = ({
  isDownLoad,
  iconTitle,
  title,
  iconAdd,
  AddTitle,
  IsShowModal = null,
  selectionType = "checkbox",
  data: dataSource = [],
  isLoading = false,
  columns = [],
  handleDeleteMany,
  ...rests
}) => {
  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  const newColumnExport = useMemo(() => {
    const arr = columns?.filter(
      (col) => col?.dataIndex !== "action" && col?.dataIndex !== "image"
    );
    return arr;
  }, [columns]);

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
  };

  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true,
      })
      .saveAs("Excel.xlsx");
  };
  return (
    <Loading isLoading={isLoading}>
      <TopAdmin
        isDownLoad={isDownLoad}
        iconTitle={iconTitle}
        title={title}
        iconAdd={iconAdd}
        AddTitle={AddTitle}
        onClickEx={exportExcel}
        IsShowModal={IsShowModal}
      />
      {!!rowSelectedKeys.length && (
        <div
          style={{
            background: "#FF642F",
            color: "#fff",
            fontWeight: "bold",
            padding: "10px",
            cursor: "pointer",
          }}
          className="rounded-t-lg"
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        {...rests}
      />
    </Loading>
  );
};

export default TableComponent;
