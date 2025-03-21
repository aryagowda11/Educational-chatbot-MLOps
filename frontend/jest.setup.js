import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: "div",
    h1: "h1",
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return "";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock video.js
jest.mock("video.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));
