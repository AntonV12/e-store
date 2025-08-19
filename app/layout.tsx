import "./globals.css";
import { Play, Press_Start_2P } from "next/font/google";
// import MainPage from "@/components/MainPage";
import styles from "@/app/page.module.css";
import Logo from "@/components/logo/Logo";
import SignLinks from "@/components/signLinks/SignLinks";
import { MessageProvider } from "@/components/providers/MessageProvider";

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
  const currentYear = new Date().getFullYear();

  return (
    <html lang="ru-ru">
      <body className={`html ${play.variable} ${press_Start_2P.variable}`}>
        {/*<MainPage children={children} />*/}
        <>
          <MessageProvider>
            <section className={styles.container}>
              <aside className={styles.sidebar}>
                <Logo />
              </aside>

              <main className={styles.main}>{children}</main>
              <aside className={styles.sidebar}>
                <SignLinks />
              </aside>
            </section>
          </MessageProvider>
          <footer className={styles.footer}>&copy; AntonV {currentYear}</footer>
          {/*{message && (
        <Message text={message} onHide={() => dispatch(setMessage(""))} />
      )}*/}
        </>
      </body>
    </html>
  );
}
