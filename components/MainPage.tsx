"use client";
import styles from "@/styles/layout.module.css";
import { Nav } from "@/components/Nav";
import SignLinks from "@/components/SignLinks";
import Message from "@/components/message/Message";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/lib/hooks";
import { setMessage } from "@/lib/features/message/messageSlice";

export default function MainPage({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();
  const dispatch = useAppDispatch();
  const message = useSelector((state: { message: { text: string } }) => state.message.text);

  return (
    <>
      <section className={styles.container}>
        <aside className={styles.sidebar}>
          <Nav />
        </aside>

        <main className={styles.main}>{children}</main>
        <aside className={styles.sidebar}>
          <SignLinks />
        </aside>
      </section>
      <footer className={styles.footer}>&copy; AntonV {currentYear}</footer>
      {message && <Message text={message} onHide={() => dispatch(setMessage(""))} />}
    </>
  );
}
