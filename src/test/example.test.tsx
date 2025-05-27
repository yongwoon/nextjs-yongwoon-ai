import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// Simple component for testing
function TestComponent({ title }: { title: string }) {
  return <h1>{title}</h1>;
}

describe("Example Test", () => {
  it("renders a heading", () => {
    render(<TestComponent title="Hello World" />);

    const heading = screen.getByRole("heading", { name: /hello world/i });
    expect(heading).toBeInTheDocument();
  });

  it("performs basic math", () => {
    expect(2 + 2).toBe(4);
  });

  it("checks if arrays are equal", () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    expect(arr1).toEqual(arr2);
  });
});
