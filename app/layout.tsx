import Image from "next/image";
import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";
import { Nav } from "./components/Nav";
import "./styles/globals.css";
import styles from "./styles/layout.module.css";
import { Knewave, Play } from "next/font/google";

interface Props {
  readonly children: ReactNode;
}

const knewave = Knewave({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-knewave",
  display: "swap",
});

const play = Play({
  weight: "400",
  subsets: ["cyrillic"],
  variable: "--font-play",
  display: "swap",
});

export default function RootLayout({ children }: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <StoreProvider>
      <html lang="en" className={`html ${knewave.variable} ${play.variable}`}>
        <body>
          <section className={styles.container}>
            <header className={styles.header}>
              <Nav />
            </header>

            <main className={styles.main}>{children}</main>

            <footer className={styles.footer}>&copy; AntonV {currentYear}</footer>
          </section>
        </body>
      </html>
    </StoreProvider>
  );
}
