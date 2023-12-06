import { StudentInfoType } from "@ts/types";
import { STUDENT_INFO_URL } from "@constant/index";

export const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(`Error in retrieving data from ${url}`);
  }
};
export const sendData = async (
  url: string,
  method: "POST" | "PUT",
  data: any //eslint-disable-line
): Promise<boolean> => {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    return true;
  } else {
    throw new Error(`Error in sending data`);
  }
};

export const deleteData = async (url: string): Promise<boolean> => {
  const response = await fetch(url, {
    method: "DELETE",
  });
  if (response.ok) {
    return true;
  } else {
    throw new Error(`Error in deleting data from ${url}`);
  }
};

export const checkEmailExists = async (
  email: string,
  id?: number
): Promise<boolean> => {
  try {
    const data = await fetchData(STUDENT_INFO_URL);
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
