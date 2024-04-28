import { useEffect, MouseEvent } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type TablePropsTypes = {
  columns: GridColDef[];
  rows: {
    [key: string]: unknown;
  }[];
  tableClassName?: string;
  stickyHeader?: boolean;
  pagination?: boolean;
  getData: (pagination: boolean, page?: number, searchText?: string) => void;
  isLoading: boolean;
  rowCount?: number;
  paginationModel?: {
    page: number;
    pageSize: number;
  };
  setPaginationModel?: (paginationModel: {
    page: number;
    pageSize: number;
  }) => void;
  onRowClick?: (event: MouseEvent<Element>, row: unknown) => void;
  searchText?: string;
};

const TableComponent = ({
  columns,
  rows,
  tableClassName = "",
  pagination = false,
  getData,
  isLoading,
  rowCount = 100,
  paginationModel,
  setPaginationModel,
  onRowClick,
  searchText = "",
}: TablePropsTypes) => {
  useEffect(() => {
    if (pagination) getData(pagination, paginationModel!.page, searchText);
  }, [paginationModel]);

  return (
    <DataGrid
      sx={{
        "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
          outline: "none !important",
        },
        "& .MuiDataGrid-columnHeader:focus-within": {
          outline: "none !important",
        },
      }}
      onRowClick={({ row }, event) => {
        onRowClick!(event, row);
      }}
      loading={isLoading}
      className={tableClassName}
      rows={rows}
      columns={columns}
      hideFooterPagination={!pagination}
      onPaginationModelChange={setPaginationModel}
      paginationMode="server"
      paginationModel={paginationModel}
      pageSizeOptions={[10]}
      disableColumnFilter
      disableColumnMenu
      disableColumnSelector
      disableRowSelectionOnClick
      sortingOrder={[null]}
      rowCount={rowCount}
    />
  );
};

export default TableComponent;
