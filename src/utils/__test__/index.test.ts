import {
  extractArrayFromApiData,
  catchErrorMessage,
  getStatusColor,
  dateFormat,
  getLocalStorage,
  deleteLocalStorage,
  setLocalStorage,
  todayDate,
  capitalize,
} from "../index";

jest.mock("axios");

describe("extractArrayFromApiData", () => {
  it("should extract array from API data correctåly", () => {
    const data = [
      { id: 1, attributes: {} },
      { id: 2, attributes: {} },
      { id: 3, attributes: {} },
    ];
    expect(extractArrayFromApiData(data)).toEqual([1, 2, 3]);
  });
});

describe("catchErrorMessage", () => {
  it("should return the error message from AxiosError", () => {
    const error = { response: { data: { message: "Error" } } };
    expect(catchErrorMessage(error)).toBe("Error");
  });

  it("should return a default error message if error is not an AxiosError", () => {
    const error = new Error("Error");
    expect(catchErrorMessage(error)).toBe("An error occurred");
  });
});

describe("getStatusColor", () => {
  it("should return the correct status color and text color", () => {
    expect(getStatusColor("active")).toEqual({
      color: "green",
      textColor: "white",
    });
  });
});

describe("dateFormat", () => {
  it("should format the date correctly", () => {
    expect(dateFormat("2022-01-01")).toBe("01/01/2022");
  });
});

describe("getLocalStorage", () => {
  it("should get the value from local storage", () => {
    localStorage.setItem("key", "value");
    expect(getLocalStorage("key")).toBe("value");
  });
});

describe("deleteLocalStorage", () => {
  it("should delete the value from local storage", () => {
    localStorage.setItem("key", "value");
    deleteLocalStorage("key");
    expect(localStorage.getItem("key")).toBeNull();
  });
});

describe("setLocalStorage", () => {
  it("should set the value in local storage", () => {
    setLocalStorage("key", "value");
    expect(localStorage.getItem("key")).toBe("value");
    deleteLocalStorage("key");
  });
});

describe("todayDate", () => {
  it("should return the current date in ISO format", () => {
    const date = new Date();
    expect(todayDate()).toBe(date.toISOString().split("T")[0]);
  });
});

describe("capitalize", () => {
  it("should capitalize the first letter of a string", () => {
    expect(capitalize("test")).toBe("Test");
  });
});
