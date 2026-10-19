import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Eye, Trash, Tag } from "feather-icons-react";
import { Tooltip } from "react-tooltip";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import Sidebar from "../../components/Sidebar";
import Paginate from "../../components/Paginate";
import FormGroup from "../../components/FormGroup";
import styles from "./ProductList.module.scss";
import ProductCard from "../../components/Product";

function ProductList() {
  const token = useSelector((state) => state.auth.token);
  const [products, setProducts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [title, setTitle] = useState("");
  const [handle, setHandle] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [grams, setGrams] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newHandle, setNewHandle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newBarcode, setNewBarcode] = useState("");
  const [newGrams, setNewGrams] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newComparePrice, setNewComparePrice] = useState("");

  const [createModal, setCreateModal] = useState(false);

  const [editModal, setEditModal] = useState({
    active: false,
  });

  const [deleteModal, setDeleteModal] = useState({
    active: false,
  });

  const handleNewTitleChange = (e) => setNewTitle(e.target.value);
  const handleNewHandleChange = (e) => {
    setNewHandle(e.target.value);
  };
  const handleNewDescriptionChange = (e) => {
    setNewDescription(e.target.value);
  };
  const handleNewSkuChange = (e) => setNewSku(e.target.value);
  const handleNewBarcodeChange = (e) => setNewBarcode(e.target.value);
  const handleNewGramsChange = (e) => setNewGrams(e.target.value);
  const handleNewStockChange = (e) => setNewStock(e.target.value);
  const handleNewPriceChange = (e) => setNewPrice(e.target.value);
  const handleNewComparePriceChange = (e) => setNewComparePrice(e.target.value);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleHandleChange = (e) => setHandle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleSkuChange = (e) => setSku(e.target.value);
  const handleBarcodeChange = (e) => setBarcode(e.target.value);
  const handleGramsChange = (e) => setGrams(e.target.value);
  const handleStockChange = (e) => setStock(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);
  const handleComparePriceChange = (e) => setComparePrice(e.target.value);

  const handleProductCreate = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/products`, {
        method: "post",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          handle: newHandle,
          description: newDescription,
          sku: newSku,
          barcode: newBarcode,
          grams: newGrams,
          stock: newStock,
          price: newPrice,
          compare_price: newComparePrice,
        }),
      });
      const data = await response.json();
      if (data.status === 500 || data.status === 404) {
        toast.error("Failed to create product");
      }
      if (data.status === 201) {
        toast.success("Product created");
        fetchProducts(currentPage);
        handleCloseCreateModal();
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error. Try again");
    }
  };

  const handleProductDelete = async (sku) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${sku}`,
        {
          method: "delete",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === 500 || data.status === 404) {
        toast.error("Update error");
      }
      if (data.status === 200) {
        toast.success("Product deleted");
        fetchProducts(currentPage);
        handleCloseDeleteModal();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleProductUpdate = async (productData) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${productData.sku}`,

        {
          method: "put",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            handle,
            description,
            sku,
            barcode,
            grams,
            stock,
            price,
            comparePrice,
          }),
        }
      );
      const data = await response.json();
      if (data.status === 500 || data.status === 404) {
        toast.error("Update error");
      }
      if (data.status === 200) {
        toast.success("Product updated");
        fetchProducts(currentPage);
        handleCloseEditModal();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleCloseCreateModal = () => {
    setNewTitle("");
    setNewHandle("");
    setNewDescription("");
    setNewSku("");
    setNewBarcode("");
    setNewGrams("");
    setNewStock("");
    setNewPrice("");
    setNewComparePrice("");
    setCreateModal(false);
  };
  const handleShowCreateModal = () => setCreateModal(true);

  const handleShowEditModal = (product) => {
    setTitle(product.title);
    setHandle(product.handle);
    setDescription(product.description);
    setSku(product.sku);
    setBarcode(product.barcode);
    setGrams(product.grams);
    setStock(product.stock);
    setPrice(product.price);
    setComparePrice(product.compare_price);
    setEditModal({ active: true, ...product });
  };
  const handleCloseEditModal = () => setEditModal({ active: false });

  const handleShowDeleteModal = (product) => {
    setDeleteModal({ active: true, ...product });
  };
  const handleCloseDeleteModal = () => setDeleteModal({ active: false });

  const fetchProducts = async (page) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products?page=${page}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { result: data } = await response.json();

      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalProducts(data.count);
    } catch (err) {
      console.log(err);
    }
  };

  const paginateProps = { currentPage, totalPages, handlePageChange };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  return (
    <>
      <div className={styles.mainWrapper}>
        <Sidebar />
        <main>
          <div className="container-fluid" style={{ paddingLeft: "200px" }}>
            <div className="row">
              <div className="col-12">
                <header
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h1>Productos</h1>
                  <button
                    className={styles.button__create}
                    onClick={handleShowCreateModal}
                  >
                    + Nuevo
                  </button>
                </header>
                {products && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "1rem 0",
                      gap: "1rem",
                    }}
                  >
                    <div className={styles.table__info}>
                      <small>
                        {totalProducts} resultados <b>·</b> Mostrando{" "}
                        {currentPage} de {totalPages} páginas
                      </small>
                      <Paginate {...paginateProps} />
                    </div>
                    {products.map((product) => {
                      return (
                        <ProductCard
                          product={product}
                          handleShowEditModal={handleShowEditModal}
                          handleShowDeleteModal={handleShowDeleteModal}
                        />
                      );
                    })}

                    <div className={styles.table__info}>
                      <small>
                        {totalProducts} resultados <b>·</b> Mostrando{" "}
                        {currentPage} de {totalPages} páginas
                      </small>
                      <Paginate {...paginateProps} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Modal show={editModal.active} onHide={handleCloseEditModal}>
        <form action="" style={{ padding: "1rem", fontSize: "0.875rem" }}>
          <FormGroup
            title="Title"
            name="title"
            value={title}
            onChange={handleTitleChange}
          />
          <FormGroup
            title="Handle"
            name="handle"
            value={handle}
            onChange={handleHandleChange}
          />
          <FormGroup
            title="Description"
            name="description"
            value={description}
            type="textarea"
            onChange={handleDescriptionChange}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: "1rem",
            }}
          >
            <FormGroup
              title="SKU"
              name="sku"
              value={sku}
              onChange={handleSkuChange}
            />
            <FormGroup
              title="Barcode"
              name="barcode"
              value={barcode}
              onChange={handleBarcodeChange}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: "1rem",
            }}
          >
            <FormGroup
              title="Grams"
              name="grams"
              value={grams}
              onChange={handleGramsChange}
            />
            <FormGroup
              title="Stock"
              name="stock"
              value={stock}
              onChange={handleStockChange}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: "1rem",
            }}
          >
            <FormGroup
              title="Price"
              name="price"
              value={price}
              onChange={handlePriceChange}
            />
            <FormGroup
              title="Compare price"
              name="compare_price"
              value={comparePrice}
              onChange={handleComparePriceChange}
            />
          </div>
        </form>
        <div style={{ padding: "0 1rem 1rem 1rem" }}>
          <button
            className={styles.button__save}
            onClick={() => handleProductUpdate(editModal)}
          >
            Save changes
          </button>
          <button
            onClick={handleCloseEditModal}
            className={styles.button__close}
          >
            Close
          </button>
        </div>
      </Modal>
      <Modal show={createModal} onHide={handleCloseCreateModal}>
        <form action="" style={{ padding: "1rem", fontSize: "0.875rem" }}>
          <FormGroup
            title="Title"
            name="title"
            value={newTitle}
            onChange={handleNewTitleChange}
          />
          <FormGroup
            title="Handle"
            name="handle"
            value={newHandle}
            onChange={handleNewHandleChange}
          />
          <FormGroup
            title="Description"
            name="description"
            value={newDescription}
            type="textarea"
            onChange={handleNewDescriptionChange}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: "1rem",
            }}
          >
            <FormGroup
              title="SKU"
              name="sku"
              value={newSku}
              onChange={handleNewSkuChange}
            />
            <FormGroup
              title="Barcode"
              name="barcode"
              value={newBarcode}
              onChange={handleNewBarcodeChange}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: "1rem",
            }}
          >
            <FormGroup
              title="Grams"
              name="grams"
              value={newGrams}
              onChange={handleNewGramsChange}
            />
            <FormGroup
              title="Stock"
              name="stock"
              value={newStock}
              onChange={handleNewStockChange}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: "1rem",
            }}
          >
            <FormGroup
              title="Price"
              name="price"
              value={newPrice}
              onChange={handleNewPriceChange}
            />
            <FormGroup
              title="Compare price"
              name="compare_price"
              value={newComparePrice}
              onChange={handleNewComparePriceChange}
            />
          </div>
        </form>
        <div style={{ padding: "0 1rem 1rem 1rem" }}>
          <button
            className={styles.button__save}
            onClick={() => handleProductCreate()}
          >
            Save changes
          </button>
          <button
            onClick={handleCloseCreateModal}
            className={styles.button__close}
          >
            Close
          </button>
        </div>
      </Modal>
      <Modal show={deleteModal.active} onHide={handleCloseDeleteModal}>
        <div style={{ padding: "1rem" }}>
          <p>Are you sure you want to delete this product?</p>
          <button
            onClick={handleCloseDeleteModal}
            className={styles.button__close}
          >
            Close
          </button>
          <button
            className={styles.button__delete}
            onClick={() => handleProductDelete(deleteModal.sku)}
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}

export default ProductList;
