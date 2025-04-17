<<<<<<< HEAD
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/_context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
=======
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/_context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import 'katex/dist/katex.min.css';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-inter",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap", // Ensures text is visible while the font loads
  variable: "--font-nunito",
>>>>>>> 911c895 (Initial Mask commit)
});

export const metadata = {
  title: "Graid - Future of Learning",
  description: "Experience the future of learning with Graid",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
<<<<<<< HEAD
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
=======
        className={`${inter.variable} ${nunito.variable}`}
        suppressHydrationWarning
      >
        <ToastContainer />
        <AuthProvider>{children}</AuthProvider>
>>>>>>> 911c895 (Initial Mask commit)
      </body>
    </html>
  );
}
