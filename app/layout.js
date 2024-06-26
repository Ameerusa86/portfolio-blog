import { K2D } from "next/font/google";
import "./globals.css";

const k2d = K2D({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "My Portfolio Blog",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={k2d.className}>{children}</body>
    </html>
  );
}
