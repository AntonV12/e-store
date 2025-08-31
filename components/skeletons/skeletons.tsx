import styles from "./skeletons.module.css";

export function SignLinksSkeleton() {
  return <div className={`${styles.skeleton} ${styles.skeleton__signLinks}`}></div>;
}

export function ProductsListSkeleton() {
  function render() {
    const skeletons: React.ReactNode[] = [];

    for (let i = 0; i < 20; i++) {
      skeletons.push(<div key={i} className={`${styles.skeleton} ${styles.skeleton__productsList}`}></div>);
    }
    return skeletons;
  }

  return (
    <div className={styles.skeleton}>
      {/*<div
        className={`${styles.skeleton} ${styles.skeleton__searchForm}`}
      ></div>*/}
      {render()}
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className={`${styles.skeleton} ${styles.skeleton__product}`}>
      <div className={`${styles.skeleton} ${styles.skeleton__product__container}`}>
        <div className={`${styles.skeleton} ${styles.skeleton__product__image}`}></div>
        <div className={`${styles.skeleton} ${styles.skeleton__product__info}`}></div>
      </div>
      <div className={`${styles.skeleton} ${styles.skeleton__product__comments}`}></div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className={`${styles.skeleton} ${styles.skeleton_profile}`}>
      <div className={`${styles.skeleton} ${styles.skeleton__profile__title}`}></div>
      <div className={`${styles.skeleton} ${styles.skeleton__profile__data}`}></div>
      <div className={`${styles.skeleton} ${styles.skeleton__profile__title}`}></div>
      <div className={`${styles.skeleton} ${styles.skeleton__profile__list}`}></div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className={`${styles.skeleton} ${styles.skeleton__cart}`}>
      <div className={`${styles.skeleton} ${styles.skeleton__cart__list}`}>
        <div className={`${styles.skeleton} ${styles.skeleton__cart__item}`}></div>
        <div className={`${styles.skeleton} ${styles.skeleton__cart__item}`}></div>
        <div className={`${styles.skeleton} ${styles.skeleton__cart__item}`}></div>
        <div className={`${styles.skeleton} ${styles.skeleton__cart__total}`}></div>
      </div>
    </div>
  );
}
