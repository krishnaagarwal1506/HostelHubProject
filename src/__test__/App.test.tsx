import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

import App from "../App";

describe("App Component heading test", () => {
  it("isHeadingCorrect_true", () => {
    render(<App />);
    const heading = screen.getByText("HostelHub DashBoard");
    expect(heading).toBeInTheDocument();
  });
});
