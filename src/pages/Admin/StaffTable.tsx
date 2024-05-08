import TableComponent from "@components/Table";
import { Add as AddIcon } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import { GridColDef, GridColumnHeaderParams } from "@mui/x-data-grid";
import DialogModal from "@src/components/DialogModal";
import { GymMembersType } from "@src/ts/types";
import { dateFormat } from "@src/utils";
import { useState } from "react";

const commonOptions = {
  sortable: false,
  renderHeader({ colDef: { headerName } }: GridColumnHeaderParams) {
    return <Typography className="font-semibold">{headerName}</Typography>;
  },
};

type GymTablePropsTypes = {
  GymList: GymMembersType[] | null;
  getData: () => void;
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
    field: "student",
    headerName: " Name",
    minWidth: 170,
    flex: 2,
    renderCell({ row }) {
      return (
        <Typography>{row.student?.data?.attributes?.studentName}</Typography>
      );
    },
  },
  {
    field: "Duration",
    headerName: "Duration",
    minWidth: 100,
    flex: 2,
    ...commonOptions,
  },
  {
    field: "JoiningDate",
    headerName: "Joining Date",
    minWidth: 100,
    flex: 2,
    renderCell({ value }) {
      return <Typography>{dateFormat(value)}</Typography>;
    },
    ...commonOptions,
  },
];
export default function StaffTable({
  GymList: staffList,
  getData,
  paginationModel,
  setPaginationModel,
}: GymTablePropsTypes) {
  const [addMember, setAddMember] = useState(false);

  return (
    <Paper className="w-full pb-8 md:w-[48%] lg:w-1/2 px-0 h-1/2 md:h-full flex-grow overflow-hidden rounded-xl">
      <Box className="mx-8 my-4 mb-2.5 flex justify-between">
        <Typography className="text-xl md:text-2xl font-medium">
          GYM Members
        </Typography>
        <Button
          className="hover:bg-primary-dark "
          variant="contained"
          endIcon={<AddIcon />}
          onClick={() => setAddMember(true)}
        >
          ADD
        </Button>
      </Box>
      <DialogModal
        isOpen={addMember}
        title={"Add New Member"}
        handleClose={() => setAddMember(false)}
      >
        <Typography variant="h6" className="text-lg md:text-xl padding-t-2 ">
          Name
        </Typography>
      </DialogModal>
      <TableComponent
        columns={columns}
        isLoading={!staffList}
        rows={staffList || []}
        tableClassName="px-6 pb-4 h-full border-0"
        getData={getData}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </Paper>
  );
}
