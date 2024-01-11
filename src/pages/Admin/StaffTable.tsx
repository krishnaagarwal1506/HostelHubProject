import { useState } from "react";
import {
  Paper,
  SelectChangeEvent,
  Typography,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import { GridColDef, GridColumnHeaderParams } from "@mui/x-data-grid";

import TableComponent from "@components/Table";
import ChipComponent from "@components/Chip";
import { StaffMembersType, StaffStatusType } from "@src/ts/types";
import { ABSENT, ALL, PRESENT } from "@src/constant";
import { capitalize } from "@src/utils";

const menuOptions = [
  { value: capitalize(ALL) },
  { value: capitalize(PRESENT) },
  { value: capitalize(ABSENT) },
];
const commonOptions = {
  sortable: false,
  renderHeader({ colDef: { headerName } }: GridColumnHeaderParams) {
    return <Typography className="font-semibold">{headerName}</Typography>;
  },
};

type StaffTablePropsTypes = {
  staffList: StaffMembersType[] | null;
  getData: () => void;
  paginationModel: {
    page: number;
    pageSize: number;
  };
  setPaginationModel: (paginationModel: {
    page: number;
    pageSize: number;
  }) => void;
  handleFilter: (event: SelectChangeEvent<StaffStatusType>) => void;
};

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Staff Name",
    minWidth: 170,
    flex: 2,
    ...commonOptions,
  },
  {
    field: "position",
    headerName: "Position",
    minWidth: 100,
    flex: 2,
    ...commonOptions,
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 100,
    flex: 1,
    headerAlign: "center",
    ...commonOptions,
    renderCell: ({ value }) => (
      <ChipComponent className="w-[95%]" text={value} type={value} />
    ),
  },
];
export default function StaffTable({
  staffList,
  getData,
  paginationModel,
  setPaginationModel,
  handleFilter,
}: StaffTablePropsTypes) {
  const [filter, setFilter] = useState<StaffStatusType>("All");

  const handleChange = (event: SelectChangeEvent<StaffStatusType>) => {
    setFilter(event.target.value as StaffStatusType);
    handleFilter(event);
  };

  return (
    <Paper className="w-full pb-8 md:w-[48%] lg:w-1/2 px-0 h-1/2 md:h-full flex-grow overflow-hidden rounded-xl">
      <Box className="flex justify-between">
        <Typography className="mx-8 my-4 mb-2.5 text-xl md:text-2xl font-medium ">
          Staff Members
        </Typography>
        <Select
          value={filter}
          className="mx-8 my-4 w-28"
          onChange={handleChange}
          size="small"
          inputProps={{
            "data-testid": "filter",
          }}
        >
          {menuOptions.map(({ value }) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </Box>
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
