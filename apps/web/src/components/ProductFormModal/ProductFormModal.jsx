import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { X } from "feather-icons-react";
import { PRODUCT_FIELDS, errorsByField, productSchema } from "@haciendola/shared";
import FormGroup from "../FormGroup";
import styles from "./ProductFormModal.module.scss";

const emptyProduct = Object.fromEntries(PRODUCT_FIELDS.map((field) => [field, ""]));

// "Glitter Glue 23 g" -> "glitter-glue-23-g", the same shape as the catalog's.
const toHandle = (title) =>
  title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Creates a product when `product` is null, edits it otherwise. `onSubmit`
// gets the form values and resolves to true when the API accepted them.
function ProductFormModal({ show, product, onClose, onSubmit }) {
  // Kept from when the modal opened, so the title doesn't switch to "New
  // product" while the edit modal fades out.
  const [openedWith, setOpenedWith] = useState(null);
  const isEdit = Boolean(openedWith);
  const [values, setValues] = useState(emptyProduct);
  // While creating, the handle follows the title until it's edited by hand.
  const [handleTouched, setHandleTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  // Problems found on the last save, by field, e.g. { price: "Price is required" }.
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!show) return;
    setOpenedWith(product);
    setValues(
      product
        ? Object.fromEntries(PRODUCT_FIELDS.map((field) => [field, product[field] ?? ""]))
        : emptyProduct
    );
    setHandleTouched(Boolean(product));
    setSaving(false);
    setErrors({});
  }, [show, product]);

  // Editing a field clears its error (and the handle's, when the title fills
  // it in; the compare-at price's, when the price it's checked against changes).
  const clearErrors = (...fields) =>
    setErrors((current) => {
      const next = { ...current };
      fields.forEach((field) => delete next[field]);
      return next;
    });

  const set = (field) => (e) => {
    const value = e.target.value;
    setValues((current) => {
      const next = { ...current, [field]: value };
      if (field === "title" && !handleTouched) next.handle = toHandle(value);
      return next;
    });
    if (field === "handle") setHandleTouched(true);
    clearErrors(
      field,
      ...(field === "title" && !handleTouched ? ["handle"] : []),
      ...(field === "price" ? ["compare_price"] : [])
    );
  };

  // Checked with the same rules the API applies, so mistakes show next to
  // their field instead of coming back one at a time from the server.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = productSchema.safeParse(values);
    if (!parsed.success) {
      const found = errorsByField(parsed.error);
      setErrors(found);
      const first = PRODUCT_FIELDS.find((name) => found[name]);
      document.getElementById(first)?.focus();
      return;
    }
    setSaving(true);
    const saved = await onSubmit(parsed.data);
    if (!saved) setSaving(false);
  };

  const field = (name) => ({
    name,
    value: values[name],
    onChange: set(name),
    error: errors[name],
  });

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      contentClassName={styles.modal}
      aria-labelledby="product-form-title"
    >
      <form onSubmit={handleSubmit} noValidate>
        <header className={styles.modal__header}>
          <div>
            <h2 id="product-form-title" className={styles.modal__title}>
              {isEdit ? "Edit product" : "New product"}
            </h2>
            <p className={styles.modal__subtitle}>
              {isEdit ? `#${openedWith.id} · ${openedWith.title}` : "Add a product to your catalog."}
            </p>
          </div>
          <button type="button" className={styles.modal__close} onClick={onClose} aria-label="Close">
            <X size="18" />
          </button>
        </header>

        <div className={styles.modal__body}>
          <section className={styles.section}>
            <h3 className={styles.section__title}>Details</h3>
            <FormGroup title="Title" required autoFocus={!isEdit} {...field("title")} />
            <FormGroup
              title="Handle"
              required
              hint="Used in the product's URL. Lowercase letters, numbers and dashes."
              {...field("handle")}
            />
            <FormGroup title="Description" type="textarea" hint="HTML is allowed." {...field("description")} />
          </section>

          <section className={styles.section}>
            <h3 className={styles.section__title}>Identifiers</h3>
            <div className={styles.row}>
              <FormGroup title="SKU" required type="number" min="1" inputMode="numeric" {...field("sku")} />
              <FormGroup title="Barcode" type="number" min="1" inputMode="numeric" hint="Products without a barcode are disabled." {...field("barcode")} />
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.section__title}>Pricing &amp; inventory</h3>
            <div className={styles.row}>
              <FormGroup title="Price" required type="number" min="0" inputMode="numeric" prefix="$" {...field("price")} />
              <FormGroup title="Compare-at price" type="number" min="0" inputMode="numeric" prefix="$" hint="Shown crossed out next to the price." {...field("compare_price")} />
            </div>
            <div className={styles.row}>
              <FormGroup title="Stock" type="number" min="0" inputMode="numeric" {...field("stock")} />
              <FormGroup title="Weight" type="number" min="0" inputMode="numeric" suffix="g" {...field("grams")} />
            </div>
          </section>
        </div>

        <footer className={styles.modal__footer}>
          <button type="button" className={styles.button__secondary} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.button__primary} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}

export default ProductFormModal;
