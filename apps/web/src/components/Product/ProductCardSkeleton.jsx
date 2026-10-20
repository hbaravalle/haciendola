import classNames from "classnames";
import styles from "./ProductCard.module.scss";

// Placeholder with the same layout as ProductCard, shown while a page loads so
// the grid doesn't jump when the products arrive.
function ProductCardSkeleton() {
  const bar = (className) => (
    <span className={classNames(styles.skeleton__bar, className)} />
  );

  return (
    <div className={classNames(styles.productCard, styles.skeleton)} aria-hidden="true">
      <div className={styles.productCard__topSection}>
        {bar(styles["skeleton__bar--id"])}
        {bar(styles["skeleton__bar--stock"])}
      </div>
      <div>
        {bar(styles["skeleton__bar--title"])}
        {bar(styles["skeleton__bar--price"])}
      </div>
      <div className={styles.productCard__bottomSection}>
        <div className={styles.productCard__meta}>
          {[0, 1, 2].map((i) => (
            <div key={i}>
              {bar(styles["skeleton__bar--label"])}
              {bar(styles["skeleton__bar--value"])}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
