import "./globals.css";
import { Play, Press_Start_2P } from "next/font/google";
import MainPage from "@/components/MainPage";

const play = Play({
  weight: "400",
  subsets: ["cyrillic"],
  variable: "--font-play",
  display: "swap",
});

const press_Start_2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press_Start_2P",
  display: "swap",
});

export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`html ${play.variable} ${press_Start_2P.variable}`}>
        <MainPage children={children} />
      </body>
    </html>
  );
}
