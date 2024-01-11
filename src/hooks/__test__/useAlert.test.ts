import { renderHook, act } from "@testing-library/react";
import useAlert from "../useAlert";

describe("useAlert", () => {
  it("should set and clear alert message", () => {
    const { result } = renderHook(useAlert);
    act(() => {
      result.current.handleAlert(true, "This is an alert message", "success");
    });
    expect(result.current.alert.message).toBe("This is an alert message");
    expect(result.current.alert.severity).toBe("success");
    act(() => {
      result.current.handleAlert(false);
    });
  });

  it("close the alert", () => {
    const { result } = renderHook(useAlert);
    act(() => {
      result.current.handleAlert(true, "This is an alert message", "success");
    });
    expect(result.current.alert.isOpen).toBe(true);
    act(() => {
      result.current.handleAlert(false);
    });
    expect(result.current.alert.isOpen).toBe(false);
  });
});
