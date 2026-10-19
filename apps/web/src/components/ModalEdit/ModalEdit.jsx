import { Modal } from "react-bootstrap";
import FormGroup from "../FormGroup";

function ModalEdit({ showModal, handleCloseModal }) {
  return (
    <Modal show={showModal.active} onHide={handleCloseModal}>
      {/* <Modal.Header closeButton></Modal.Header> */}
      <form action="" style={{ padding: "1rem", fontSize: "0.875rem" }}>
        <FormGroup title="Title" name="title" value={showModal.title} />
        <FormGroup title="Handle" name="handle" value={showModal.handle} />
        <FormGroup
          title="Description"
          name="description"
          value={showModal.description}
          type="textarea"
        />
        <FormGroup title="SKU" name="sku" value={showModal.sku} />
        <FormGroup title="Grams" name="grams" value={showModal.grams} />
        <FormGroup title="Stock" name="stock" value={showModal.stock} />
        <FormGroup title="Price" name="price" value={showModal.price} />
        <FormGroup
          title="Compare price"
          name="compare_price"
          value={showModal.compare_price}
        />
        <FormGroup title="Barcode" name="barcode" value={showModal.barcode} />
      </form>
      <button onClick={handleCloseModal}>Close</button>
      <button>Save changes</button>
    </Modal>
  );
}

export default ModalEdit;
