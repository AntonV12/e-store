import Link from "next/link";
import styles from "./logo.module.css";

const Logo = () => {
  return (
    <nav className={styles.nav}>
      <Link className={styles.logo} href="/">
        My Store
      </Link>
    </nav>
  );
};

export default Logo;
