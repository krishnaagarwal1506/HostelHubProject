import { type AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, sendData, deleteData } from "@src/utils";
import {
  FetchAdminDashboardData,
  FetchgraphData,
  fetchNoticeData,
  fetchStaffListData,
} from "@src/ts/types";

interface ErrorResponse {
  statusCode: number;
  message: string;
  errorField: string | null | undefined;
  messages: string[];
  timestamp: string;
}

export interface SendDataParams {
  url: string;
  method: "POST" | "PUT";
  //eslint-disable-next-line
  content: any;
  wrapper?: boolean;
}

export const useFetchAdminDashboardDetails = (url: string) => {
  return useQuery<FetchAdminDashboardData | null, AxiosError<ErrorResponse>>({
    queryKey: ["fetchAdminDashboardDetails", url],
    queryFn: async () => await fetchData(url),
  });
};

export const useFetchRoomStatusGraphChart = (url: string) => {
  return useQuery<FetchgraphData | null, AxiosError<ErrorResponse>>({
    queryKey: ["fetchRoomStatusgraphData", url],
    queryFn: async () => await fetchData(url),
  });
};

export const useFetchComplaintStatusGraphChart = (url: string) => {
  return useQuery<FetchgraphData | null, AxiosError<ErrorResponse>>({
    queryKey: ["fetchComplaintStatusGraphChart", url],
    queryFn: async () => await fetchData(url),
  });
};

export const useFetchNoticeData = (url: string) => {
  return useQuery<fetchNoticeData | null, AxiosError<ErrorResponse>>({
    queryKey: ["FetchNoticeData", url],
    queryFn: async () => await fetchData(url),
  });
};

export const useFetchStaffListData = (url: string) => {
  return useQuery<fetchStaffListData | null, AxiosError<ErrorResponse>>({
    queryKey: ["FetchStaffListData", url],
    queryFn: async () => await fetchData(url),
  });
};

export const useSaveNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendData,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["FetchNoticeData"],
      });
    },
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteData,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["FetchNoticeData"],
      });
    },
  });
};
