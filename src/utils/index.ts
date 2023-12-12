import axios from "axios";
import { StudentInfoType } from "@ts/types";
import { STUDENT_INFO_URL } from "@constant/index";

export const fetchData = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Error in retrieving data`);
  }
};

export async function sendData<Type>(
  url: string,
  method: "POST" | "PUT",
  content: Type
): Promise<boolean> {
  const apiData = {
    data: content,
  };
  try {
    await axios({
      url,
      method,
      headers: {
        "Content-Type": "application/json",
      },
      data: apiData,
    });
    return true;
  } catch (error) {
    throw new Error(`Error in sending data`);
  }
}

export const deleteData = async (url: string): Promise<boolean> => {
  try {
    await axios.delete(url);
    return true;
  } catch (error) {
    throw new Error(`Error in deleting data`);
  }
};
//eslint-disable-next-line
export const extractArrayFromApiData = (data: any) => {
  //eslint-disable-next-line
  return data.map(({ id, attributes }: any) => {
    return {
      id,
      ...attributes,
    };
  });
};

export const checkEmailExists = async (
  email: string,
  id?: number
): Promise<boolean> => {
  try {
    const response = await fetchData(STUDENT_INFO_URL);
    const data = extractArrayFromApiData(response.data);
    if (id) {
      const emailExists = data.some(
        (student: StudentInfoType) =>
          student.email === email && student.id !== id
      );
      return emailExists;
    }
    const emailExists = data.some(
      (student: StudentInfoType) => student.email === email
    );
    return emailExists;
  } catch (error) {
    throw error as string;
  }
};

export const catchErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "An error occurred";
};

export const getStatusColor = (status: string, isActive: boolean = true) => {
  const opacityClass = " bg-opacity-25 border-opacity-25";
  status = status.toLowerCase();
  switch (status) {
    case "pending":
    case "filled":
    case "absent":
      return {
        boxClass: `border-error-light ${
          isActive ? `bg-error-light ${opacityClass}` : "bg-white"
        }`,
        textColor: "text-error-dark",
      };
    case "resolved":
    case "empty":
    case "present":
      return {
        boxClass: `border-success-light ${
          isActive ? `bg-success-light ${opacityClass}` : "bg-white"
        }`,
        textColor: "text-success-dark",
      };
    case "invalid":
    case "notAvalible":
      return {
        boxClass: `border-gray-500 ${
          isActive ? `bg-gray-500 ${opacityClass}` : "bg-white"
        }`,
        textColor: "text-gray-600",
      };
    case "partialFilled":
      return {
        boxClass: `border-warning-light ${
          isActive ? `bg-warning-light ${opacityClass}` : "bg-white"
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
