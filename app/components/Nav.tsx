"use client";

import Link from "next/link";
import styles from "../styles/layout.module.css";

export const Nav = () => {
  return (
    <nav className={styles.nav}>
      <Link className={styles.logo} href="/">
        My Store
      </Link>
    </nav>
  );
};
