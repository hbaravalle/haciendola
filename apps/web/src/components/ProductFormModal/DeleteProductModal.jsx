import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "./ProductFormModal.module.scss";

// Confirms before deleting. `onConfirm` resolves to true on success.
function DeleteProductModal({ product, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (product) setDeleting(false);
  }, [product]);

  const handleConfirm = async () => {
    setDeleting(true);
    const deleted = await onConfirm(product);
    if (!deleted) setDeleting(false);
  };

  return (
    <Modal
      show={Boolean(product)}
      onHide={onClose}
      centered
      contentClassName={styles.modal}
      aria-labelledby="delete-product-title"
    >
      <header className={styles.modal__header}>
        <div>
          <h2 id="delete-product-title" className={styles.modal__title}>
            Delete product?
          </h2>
          <p className={`${styles.modal__subtitle} ${styles["modal__subtitle--wrap"]}`}>
            <strong>{product?.title}</strong> will be removed from your catalog.
          </p>
        </div>
      </header>
      <footer className={styles.modal__footer}>
        <button type="button" className={styles.button__secondary} onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.button__danger}
          onClick={handleConfirm}
          disabled={deleting}
          autoFocus
        >
          {deleting ? "Deleting…" : "Delete product"}
        </button>
      </footer>
    </Modal>
  );
}

export default DeleteProductModal;
