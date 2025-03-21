import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../Navbar";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock the logo import
jest.mock("@/app/assets/loading.svg", () => ({
  src: "/mock-logo.svg",
  height: 45,
  width: 45,
}));

describe("Navbar Component", () => {
  const mockOnAuthButtonClick = jest.fn();

  beforeEach(() => {
    mockOnAuthButtonClick.mockClear();
  });

  it("renders all navigation elements", () => {
    render(<Navbar onAuthButtonClick={mockOnAuthButtonClick} />);

    // Check logo
    expect(screen.getByAltText("Graid Logo")).toBeInTheDocument();
    expect(screen.getByText("gr")).toBeInTheDocument();
    expect(screen.getByText("ai")).toBeInTheDocument();
    expect(screen.getByText("d")).toBeInTheDocument();
    expect(screen.getByText(".")).toBeInTheDocument();

    // Check navigation links
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();

    // Check auth links
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("calls onAuthButtonClick with correct type when auth links are clicked", () => {
    render(<Navbar onAuthButtonClick={mockOnAuthButtonClick} />);

    // Click signup link
    fireEvent.click(screen.getByText("Sign Up"));
    expect(mockOnAuthButtonClick).toHaveBeenCalledWith("signup");

    // Click login link
    fireEvent.click(screen.getByText("Login"));
    expect(mockOnAuthButtonClick).toHaveBeenCalledWith("login");
  });

  it("prevents default behavior when clicking auth links", () => {
    render(<Navbar onAuthButtonClick={mockOnAuthButtonClick} />);

    const signupLink = screen.getByText("Sign Up").closest("a");
    const loginLink = screen.getByText("Login").closest("a");

    fireEvent.click(signupLink, {
      preventDefault: jest.fn(),
    });

    fireEvent.click(loginLink, {
      preventDefault: jest.fn(),
    });

    expect(mockOnAuthButtonClick).toHaveBeenCalledWith("signup");
    expect(mockOnAuthButtonClick).toHaveBeenCalledWith("login");
  });

  it("has correct CSS classes for styling", () => {
    const { container } = render(
      <Navbar onAuthButtonClick={mockOnAuthButtonClick} />
    );

    expect(container.querySelector(".navbar")).toBeInTheDocument();
    expect(container.querySelector(".navbar-container")).toBeInTheDocument();
    expect(container.querySelector(".logo-container")).toBeInTheDocument();
    expect(container.querySelector(".nav-links")).toBeInTheDocument();
    expect(container.querySelector(".auth-links")).toBeInTheDocument();
  });
});
