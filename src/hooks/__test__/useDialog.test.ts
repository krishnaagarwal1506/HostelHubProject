import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import useDialog from "../useDialog";

describe("useDialog", () => {
  it("open dialog", () => {
    const { result } = renderHook(useDialog);
    act(() => {
      result.current.handleDialogClick(true);
    });
    expect(result.current.open).toBe(true);
  });

  it("close dialog", () => {
    const { result } = renderHook(useDialog);
    act(() => {
      result.current.handleDialogClick(false);
    });
    expect(result.current.open).toBe(false);
  });

  it("submit dialog", () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useDialog(onSubmit));
    act(() => {
      result.current.handleDialogSubmit();
    });
    expect(onSubmit).toHaveBeenCalled();
    expect(result.current.open).toBe(false);
  });
});
