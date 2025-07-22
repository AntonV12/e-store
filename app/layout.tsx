import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";
import "@/styles/globals.css";
import { Play, Press_Start_2P } from "next/font/google";
import MainPage from "@/components/MainPage";

interface Props {
  readonly children: ReactNode;
}

export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
};

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

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html lang="en" className={`html ${play.variable} ${press_Start_2P.variable}`}>
        <body>
          <MainPage children={children} />
        </body>
      </html>
    </StoreProvider>
  );
}
