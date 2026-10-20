import classNames from "classnames";
import Dropdown from "react-bootstrap/Dropdown";
import { Edit2, MoreVertical, Trash2 } from "feather-icons-react";
import styles from "./ProductCard.module.scss";

const money = new Intl.NumberFormat("en-US");
const formatPrice = (value) => `$${money.format(value)}`;

function ProductCard({ product, handleShowEditModal, handleShowDeleteModal }) {
  const outOfStock = !product.stock;

  return (
    <article className={styles.productCard}>
      <div className={styles.productCard__topSection}>
        <span className={styles.productCard__id}>#{product.id}</span>
        <span
          className={classNames(styles.productCard__stock, {
            [styles["productCard__stock--out"]]: outOfStock,
          })}
        >
          {outOfStock ? "Out of stock" : `${product.stock} in stock`}
        </span>
      </div>

      <div>
        <h2 className={styles.productCard__title} title={product.title}>
          {product.title}
        </h2>
        <p className={styles.productCard__price}>
          {formatPrice(product.price)}
          {product.compare_price != null && (
            <span className={styles.productCard__comparePrice}>
              {formatPrice(product.compare_price)}
            </span>
          )}
        </p>
      </div>

      <div className={styles.productCard__bottomSection}>
        <dl className={styles.productCard__meta}>
          <div>
            <dt>Handle</dt>
            <dd title={product.handle}>{product.handle}</dd>
          </div>
          <div>
            <dt>SKU</dt>
            <dd>{product.sku}</dd>
          </div>
          <div>
            <dt>Barcode</dt>
            <dd>{product.barcode ?? "—"}</dd>
          </div>
        </dl>
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="info"
            className={styles.productCard__dropdownButton}
            aria-label={`Actions for ${product.title}`}
          >
            <MoreVertical size="16" />
          </Dropdown.Toggle>

          <Dropdown.Menu className={styles.menu} popperConfig={{ strategy: "fixed" }}>
            <Dropdown.Item
              as="button"
              className={styles.menu__item}
              onClick={() => handleShowEditModal(product)}
            >
              <Edit2 size="14" /> Edit
            </Dropdown.Item>
            <Dropdown.Divider className={styles.menu__divider} />
            <Dropdown.Item
              as="button"
              className={classNames(styles.menu__item, styles["menu__item--danger"])}
              onClick={() => handleShowDeleteModal(product)}
            >
              <Trash2 size="14" /> Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </article>
  );
}

export default ProductCard;
