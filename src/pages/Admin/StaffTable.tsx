import { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Typography,
} from "@mui/material";

import { StaffMembersType } from "@src/ts/types";
import { getStaffList } from "@src/utils";

export default function StaffTable() {
  const [staffList, setStaffList] = useState<StaffMembersType[] | null>(null);

  useEffect(() => {
    const getStaffListData = async (): Promise<void> => {
      try {
        const reponse = await getStaffList();
        setStaffList(reponse);
      } catch (error) {
        console.log(error);
      }
    };
    getStaffListData();
  }, []);

  return (
    <Paper className="w-full pb-8 md:w-[48%] lg:w-1/2 px-0 h-1/2 md:h-full flex-grow overflow-hidden rounded-xl">
      <Typography className="mx-8 my-4 mb-2.5 text-2xl font-medium ">
        Staff Members
      </Typography>
      {staffList ? (
        <TableContainer className="px-4 pb-4 h-full">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="font-semibold">Staff Name</TableCell>
                <TableCell className="font-semibold" align="right">
                  Position
                </TableCell>
                <TableCell className="font-semibold" align="center">
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffList.map(({ name, position, status }, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {name}
                  </TableCell>
                  <TableCell align="right">{position}</TableCell>
                  <TableCell align="center">
                    <Typography
                      className={`${
                        status === "Present"
                          ? "bg-success-light bg-opacity-25 text-success-dark "
                          : "bg-error-light bg-opacity-25 text-error-dark "
                      }  font-bold rounded-full text-sm p-1 px-4 w-fit mx-auto`}
                    >
                      {status}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box className="h-full w-full">
          {Array.from(Array(10).keys()).map((index) => {
            return (
              <Box
                key={index}
                className="flex justify-evenly items-center  w-full"
              >
                <Skeleton height={50} width="30%" />
                <Skeleton height={50} width="30%" />
                <Skeleton height={50} width="30%" />
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
}
