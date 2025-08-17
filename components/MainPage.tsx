import styles from "@/app/page.module.css";
import Logo from "@/components/logo/Logo";
import SignLinks from "@/components/signLinks/SignLinks";
// import Message from "@/components/message/Message";

export default function MainPage({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <section className={styles.container}>
        <aside className={styles.sidebar}>
          <Logo />
        </aside>

        <main className={styles.main}>{children}</main>
        <aside className={styles.sidebar}>
          <SignLinks />
        </aside>
      </section>
      <footer className={styles.footer}>&copy; AntonV {currentYear}</footer>
      {/*{message && (
        <Message text={message} onHide={() => dispatch(setMessage(""))} />
      )}*/}
    </>
  );
}
