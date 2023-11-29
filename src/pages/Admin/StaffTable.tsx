import { Paper, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import TableComponent from "@src/components/Table";
import { StaffMembersType } from "@src/ts/types";

type StaffTablePropsTypes = {
  staffList: StaffMembersType[] | null;
  getData: (pagination: boolean, page?: number) => void;
  paginationModel: {
    page: number;
    pageSize: number;
  };
  setPaginationModel: (paginationModel: {
    page: number;
    pageSize: number;
  }) => void;
};

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Staff Name",
    minWidth: 170,
    sortable: false,
    headerClassName: "font-semibold",
    flex: 2,
    renderHeader: () => (
      <Typography className="font-semibold text-sm">Staff Name</Typography>
    ),
  },
  {
    field: "position",
    headerName: "Position",
    minWidth: 100,
    sortable: false,
    headerClassName: "font-semibold",
    flex: 2,
    renderHeader: () => (
      <Typography className="font-semibold text-sm">Position</Typography>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 100,
    sortable: false,
    flex: 1,
    headerAlign: "center",
    renderHeader: () => (
      <Typography className="font-semibold text-sm">Status</Typography>
    ),
    renderCell: ({ value }) => (
      <Typography
        className={`${
          value === "Present"
            ? "bg-success-light bg-opacity-25 text-success-dark "
            : "bg-error-light bg-opacity-25 text-error-dark "
        }  font-bold rounded-full text-sm p-1 px-4 w-fit mx-auto`}
      >
        {value}
      </Typography>
    ),
  },
];
export default function StaffTable({
  staffList,
  getData,
  paginationModel,
  setPaginationModel,
}: StaffTablePropsTypes) {
  return (
    <Paper className="w-full pb-8 md:w-[48%] lg:w-1/2 px-0 h-1/2 md:h-full flex-grow overflow-hidden rounded-xl">
      <Typography className="mx-8 my-4 mb-2.5 text-2xl font-medium ">
        Staff Members
      </Typography>
      <TableComponent
        columns={columns}
        isLoading={!staffList}
        rows={staffList || []}
        tableClassName="px-4 pb-4 h-full border-0"
        getData={getData}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </Paper>
  );
}
