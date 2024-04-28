import {
  STUDENT_INFO_URL,
  PENDING,
  RESOLVED,
  INVALID,
  FILLED,
  ABSENT,
  EMPTY,
  PRESENT,
  NOT_AVAILABLE,
  PARTIAL_FILLED,
  REJECTED,
  APPROVED,
} from "@constant/index";
import { SendDataParams } from "@src/queryHooks/query";
import axiosInstance from "@utils/axiosInstance";

interface AxiosError extends Error {
  response: {
    data: {
      error: {
        message: string;
      };
    };
  };
}

const instance = axiosInstance();

export const fetchData = async (url: string) => {
  const response = await instance.get(url);
  if (response.status !== 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.data;
};

export async function sendData(
  { url, method, content, wrapper = true }: SendDataParams
  //eslint-disable-next-line
): Promise<any> {
  const apiData = {
    data: content,
  };
  try {
    const response = await instance({
      url,
      method,
      headers: {
        "Content-Type": "application/json",
      },
      data: wrapper ? apiData : content,
    });
    return response;
  } catch (error) {
    throw new Error(`Error in sending data`);
  }
}

export const deleteData = async (url: string): Promise<boolean> => {
  try {
    await instance.delete(url);
    return true;
  } catch (error) {
    throw new Error(`Error in deleting data`);
  }
};
export function extractArrayFromApiData<Type>(
  data: {
    id: number;
    attributes: Type;
  }[]
) {
  return data.map(({ id, attributes }: { id: number; attributes: Type }) => {
    return {
      id,
      ...attributes,
    };
  });
}

export const checkEmailExists = async (
  email: string,
  id?: number
): Promise<boolean> => {
  try {
    const url = `${STUDENT_INFO_URL}?filters[email][$eq]=${email}`;
    const response = await fetchData(url);
    const data = response.data;
    if (data.length === 0 || (data.length === 1 && data[0].id === id))
      return false;
    return true;
  } catch (error) {
    throw error as string;
  }
};

export const catchErrorMessage = (error: unknown) => {
  return (
    (error as AxiosError)?.message ||
    (error as AxiosError)?.response?.data.error.message ||
    "An error occurred"
  );
};

export const getStatusColor = (status: string, isActive: boolean = true) => {
  const opacityClass = " bg-opacity-25 border-opacity-25";
  status = status.toLowerCase();
  switch (status) {
    case PENDING:
    case FILLED:
    case ABSENT:
      return {
        boxClass: `border-error-light ${
          isActive ? `bg-error-light ${opacityClass}` : "bg-white"
        }`,
        textColor: "text-error-dark",
      };
    case RESOLVED:
    case EMPTY:
    case PRESENT:
    case APPROVED:
      return {
        boxClass: `border-success-light ${
          isActive ? `bg-success-light ${opacityClass}` : "bg-white"
        }`,
        textColor: "text-success-dark",
      };
    case INVALID:
    case NOT_AVAILABLE:
    case REJECTED:
      return {
        boxClass: `border-gray-500 ${
          isActive ? `bg-gray-500 ${opacityClass}` : "bg-white"
        }`,
        textColor: "text-gray-600",
      };
    case PARTIAL_FILLED:
      return {
        boxClass: `border-warning-main ${
          isActive ? `bg-warning-main ${opacityClass}` : "bg-white"
        }`,
        textColor: "text-warning-dark",
      };
    default:
      return {
        boxClass: `border-primary-light ${
          isActive ? `bg-primary-light ${opacityClass}` : "bg-white"
        }`,
        textColor: "text-primary-dark",
      };
  }
};

export function dateFormat(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const date = new Date(dateString).toLocaleDateString(undefined, options);
  return date;
}

export const getLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  return data;
};
export const deleteLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const todayDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
