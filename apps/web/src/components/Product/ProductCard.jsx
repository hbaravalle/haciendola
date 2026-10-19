import classNames from "classnames";
import Dropdown from "react-bootstrap/Dropdown";
import { MoreVertical } from "feather-icons-react";
import styles from "./ProductCard.module.scss";

function ProductCard({ product, handleShowEditModal, handleShowDeleteModal }) {
  return (
    <div className={classNames(styles.productCard, "shadow-sm")}>
      <div className={styles.productCard__topSection}>
        <div className={styles.productCard__id}>#{product?.id}</div>
        <div className={styles.productCard__stock}>
          <strong>Stock</strong> {product?.stock}
        </div>
      </div>
      <div className={styles.ProductCard__centerSection}>
        <h2 className={styles.productCard__title}>{product.title}</h2>
        <h3 className={styles.productCard__price}>
          ${product.price}
          <span className={styles.productCard__comparePrice}>
            ${product.compare_price}
          </span>
        </h3>
      </div>
      <div className={styles.productCard__bottomSection}>
        <div className={styles.productCard__handle}>
          <h4>Handle</h4> {product.handle}
        </div>
        <div className={styles.productCard__sku}>
          <h4>SKU</h4> {product.sku}
        </div>
        <div className={styles.productCard__barcode}>
          <h4>Barcode</h4> {product.barcode}
        </div>
        <Dropdown>
          <Dropdown.Toggle
            variant="info"
            className={styles.productCard__dropdownButton}
          >
            <MoreVertical />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleShowEditModal(product)}>
              Details
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleShowDeleteModal(product)}>
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default ProductCard;
