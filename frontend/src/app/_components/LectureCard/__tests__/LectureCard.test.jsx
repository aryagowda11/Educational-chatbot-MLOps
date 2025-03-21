import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LectureCard from "../LectureCard";
import { FaPlay, FaEdit, FaTrash } from "react-icons/fa";

// Mock CSS module
jest.mock("../LectureCard.module.css", () => ({
  card: "card",
  thumbnail: "thumbnail",
  duration: "duration",
  playButton: "playButton",
  content: "content",
  title: "title",
  actions: "actions",
  editButton: "editButton",
  deleteButton: "deleteButton",
}));

// Mock react-icons
jest.mock("react-icons/fa", () => ({
  FaPlay: () => <div data-testid="play-icon" />,
  FaEdit: () => <div data-testid="edit-icon" />,
  FaTrash: () => <div data-testid="trash-icon" />,
}));

describe("LectureCard Component", () => {
  const mockLecture = {
    id: "1",
    title: "Test Lecture",
    duration: "10:00",
    thumbnail: "/test-thumbnail.jpg",
  };

  it("renders lecture information correctly", () => {
    render(<LectureCard lecture={mockLecture} />);

    expect(screen.getByText("Test Lecture")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();

    const thumbnailImg = screen.getByAltText("Test Lecture");
    expect(thumbnailImg).toHaveAttribute("src", "/test-thumbnail.jpg");
  });

  it("renders default thumbnail when none provided", () => {
    const lectureWithoutThumbnail = {
      ...mockLecture,
      thumbnail: null,
    };

    render(<LectureCard lecture={lectureWithoutThumbnail} />);

    const thumbnailImg = screen.getByAltText("Test Lecture");
    expect(thumbnailImg).toHaveAttribute(
      "src",
      "/assets/thumbnails/default.jpg"
    );
  });

  it("renders action buttons with icons", () => {
    render(<LectureCard lecture={mockLecture} />);

    expect(screen.getByTestId("play-icon")).toBeInTheDocument();
    expect(screen.getByTestId("edit-icon")).toBeInTheDocument();
    expect(screen.getByTestId("trash-icon")).toBeInTheDocument();

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    const { container } = render(<LectureCard lecture={mockLecture} />);

    expect(container.firstChild).toHaveClass("card");
    expect(screen.getByText("Test Lecture")).toHaveClass("title");
    expect(screen.getByText("10:00")).toHaveClass("duration");
  });

  it("handles long lecture titles", () => {
    const lectureWithLongTitle = {
      ...mockLecture,
      title:
        "This is a very long lecture title that might need special handling in the UI",
    };

    render(<LectureCard lecture={lectureWithLongTitle} />);
    expect(screen.getByText(lectureWithLongTitle.title)).toBeInTheDocument();
  });

  it("renders all interactive elements", () => {
    const { container } = render(<LectureCard lecture={mockLecture} />);

    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    expect(container.querySelector(".playButton")).toBeInTheDocument();
  });
});
