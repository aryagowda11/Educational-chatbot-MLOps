import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthSidebar from "../AuthSidebar";
import { useAuth } from "@/app/_hooks/useAuth";

// Mock the useAuth hook first, before any imports
const mockHandleAuth = jest.fn();
const mockResetAuth = jest.fn();
const mockSetEmail = jest.fn();
const mockSetPassword = jest.fn();
const mockSetUsername = jest.fn();
const mockSetRole = jest.fn();

// Create a default mock implementation
const defaultMockImplementation = {
  email: "test@example.com",
  setEmail: mockSetEmail,
  password: "password123",
  setPassword: mockSetPassword,
  username: "testuser",
  setUsername: mockSetUsername,
  role: "student",
  setRole: mockSetRole,
  isLoading: false,
  error: null,
  handleAuth: mockHandleAuth,
  resetAuth: mockResetAuth,
};

jest.mock("@/app/_hooks/useAuth", () => ({
  useAuth: jest.fn(() => defaultMockImplementation),
}));

describe("AuthSidebar Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    authType: "login",
    setAuthType: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockImplementation(() => defaultMockImplementation);
  });

  it("renders login form correctly", () => {
    render(<AuthSidebar {...defaultProps} />);

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByText("Don't have an account? Sign Up")
    ).toBeInTheDocument();
  });

  it("renders signup form correctly", () => {
    render(<AuthSidebar {...defaultProps} authType="signup" />);

    expect(
      screen.getByRole("heading", { name: "Sign Up" })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument(); // role selector
    expect(
      screen.getByText("Already have an account? Login")
    ).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    mockHandleAuth.mockResolvedValueOnce(true);
    render(<AuthSidebar {...defaultProps} />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockHandleAuth).toHaveBeenCalledWith("login");
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it("handles form toggle between login and signup", () => {
    render(<AuthSidebar {...defaultProps} />);

    fireEvent.click(screen.getByText("Don't have an account? Sign Up"));

    expect(defaultProps.setAuthType).toHaveBeenCalledWith("signup");
    expect(mockResetAuth).toHaveBeenCalled();
  });

  it("handles role selection in signup form", async () => {
    render(<AuthSidebar {...defaultProps} authType="signup" />);

    const roleSelect = screen.getByRole("combobox");
    await userEvent.selectOptions(roleSelect, "teacher");

    expect(mockSetRole).toHaveBeenCalledWith("teacher");
  });

  it("disables form inputs when loading", () => {
    // Override the mock for this test
    useAuth.mockImplementation(() => ({
      ...defaultMockImplementation,
      isLoading: true,
    }));

    render(<AuthSidebar {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("Password");

    expect(emailInput).toHaveAttribute("disabled");
    expect(passwordInput).toHaveAttribute("disabled");
  });

  it("displays error message when present", () => {
    // Override the mock for this test
    useAuth.mockImplementation(() => ({
      ...defaultMockImplementation,
      error: "Invalid credentials",
    }));

    render(<AuthSidebar {...defaultProps} />);
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("handles click outside to close", () => {
    render(<AuthSidebar {...defaultProps} />);

    // Simulate clicking outside the sidebar
    fireEvent.mouseDown(document.body);

    expect(defaultProps.onClose).toHaveBeenCalled();
    expect(mockResetAuth).toHaveBeenCalled();
  });
});
