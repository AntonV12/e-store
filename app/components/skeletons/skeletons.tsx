import styles from "./skeletons.module.css";

export function CardSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeleton__title}></div>
      <div className={styles.skeleton__text}></div>
      <div className={styles.skeleton__text}></div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}
