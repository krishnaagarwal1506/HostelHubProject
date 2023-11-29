import { useEffect, MouseEvent } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type TablePropsTypes = {
  columns: GridColDef[];
  rows: {
    [key: string]: string | number;
  }[];
  tableClassName?: string;
  stickyHeader?: boolean;
  pagination?: boolean;
  getData: (pagination: boolean, page?: number) => void;
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
}: TablePropsTypes) => {
  useEffect(() => {
    getData(pagination, paginationModel!.page);
  }, [paginationModel!.page]);

  return (
    <DataGrid
      sx={{
        "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
          outline: "none !important",
        },
      }}
      onRowClick={(params, event) => {
        const { row } = params;
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
