import { describe, it, expect } from "bun:test";
import { render } from "@testing-library/react";
import SectionHeader from "./SectionHeader";

describe("SectionHeader", () => {
  it("renders the title in an h1", () => {
    const { getByRole } = render(<SectionHeader title="My Library" />);
    expect(getByRole("heading", { level: 1 }).textContent).toBe("My Library");
  });

  it("renders subtitle when provided", () => {
    const { getByText } = render(<SectionHeader title="Sleeving" subtitle="Track your sleeves" />);
    expect(getByText("Track your sleeves")).toBeTruthy();
  });

  it("omits subtitle element when not provided", () => {
    const { container } = render(<SectionHeader title="Prints" />);
    expect(container.querySelector("p")).toBeNull();
  });
});
