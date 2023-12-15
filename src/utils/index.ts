import { STUDENT_INFO_URL } from "@constant/index";
import axiosInstance from "@utils/axiosInstance";

const instance = axiosInstance();

export const fetchData = async (url: string) => {
  const response = await instance.get(url);
  if (response.status !== 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.data;
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
    await instance({
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
export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};
