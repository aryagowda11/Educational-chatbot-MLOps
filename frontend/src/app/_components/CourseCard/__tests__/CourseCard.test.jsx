import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CourseCard from "../CourseCard";

// Mock CSS module
jest.mock("../CourseCard.module.css", () => ({
  courseCard: "courseCard",
  videoCount: "videoCount",
  courseName: "courseName",
}));

describe("CourseCard Component", () => {
  const mockCourse = {
    id: "1",
    title: "Test Course",
    videoCount: 5,
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("renders course information correctly", () => {
    render(<CourseCard course={mockCourse} onClick={mockOnClick} />);

    expect(screen.getByText("Test Course")).toBeInTheDocument();
    expect(screen.getByText("5 videos")).toBeInTheDocument();
  });

  it("calls onClick handler with course data when clicked", () => {
    render(<CourseCard course={mockCourse} onClick={mockOnClick} />);

    const card = screen.getByText("Test Course").closest("div");
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledWith(mockCourse);
  });

  it("applies correct CSS classes", () => {
    const { container } = render(
      <CourseCard course={mockCourse} onClick={mockOnClick} />
    );

    expect(container.firstChild).toHaveClass("courseCard");
    expect(screen.getByText("5 videos")).toHaveClass("videoCount");
    expect(screen.getByText("Test Course")).toHaveClass("courseName");
  });

  it("handles courses with zero videos", () => {
    const courseWithNoVideos = {
      ...mockCourse,
      videoCount: 0,
    };

    render(<CourseCard course={courseWithNoVideos} onClick={mockOnClick} />);
    expect(screen.getByText("0 videos")).toBeInTheDocument();
  });

  it("handles long course titles", () => {
    const courseWithLongTitle = {
      ...mockCourse,
      title:
        "This is a very long course title that might need special handling in the UI",
    };

    render(<CourseCard course={courseWithLongTitle} onClick={mockOnClick} />);
    expect(screen.getByText(courseWithLongTitle.title)).toBeInTheDocument();
  });
});
