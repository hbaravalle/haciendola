import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Plus } from "feather-icons-react";
import { PAGE_SIZE } from "@haciendola/shared";
import Sidebar from "../../components/Sidebar";
import Paginate from "../../components/Paginate";
import ProductFormModal from "../../components/ProductFormModal/ProductFormModal";
import DeleteProductModal from "../../components/ProductFormModal/DeleteProductModal";
import styles from "./ProductList.module.scss";
import ProductCard from "../../components/Product";
import ProductCardSkeleton from "../../components/Product/ProductCardSkeleton";
import { API_URL } from "../../config.js";
import { logout } from "../../redux/authSlice";

function ProductList() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [products, setProducts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const latestRequest = useRef(0);

  // Product being edited (or null), and whether the create form is open.
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Sends a product request and tells the user how it went. Returns true when
  // it worked, so the modal knows whether to close.
  const sendProduct = async (method, path, body, successMessage) => {
    try {
      const response = await fetch(`${API_URL}/products${path}`, {
        method,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body && JSON.stringify(body),
      });
      const data = await response.json();
      if (data.status >= 200 && data.status < 300) {
        toast.success(successMessage);
        fetchProducts(currentPage);
        return true;
      }
      if (data.status === 401) {
        toast("Your session ended. Sign in again", { icon: "👋" });
        dispatch(logout());
        return false;
      }
      toast.error(data.message ?? "Something went wrong. Try again");
    } catch (err) {
      console.log(err);
      toast.error("Server error. Try again");
    }
    return false;
  };

  const handleProductCreate = async (values) => {
    const created = await sendProduct("post", "", values, "Product created");
    if (created) setCreating(false);
    return created;
  };

  const handleProductUpdate = async (values) => {
    const updated = await sendProduct("put", `/${editing.sku}`, values, "Product updated");
    if (updated) setEditing(null);
    return updated;
  };

  const handleProductDelete = async (product) => {
    const deleted = await sendProduct("delete", `/${product.sku}`, null, "Product deleted");
    if (deleted) setDeleting(null);
    return deleted;
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  };

  const handleShowCreateModal = () => setCreating(true);
  const handleShowEditModal = (product) => setEditing(product);
  const handleShowDeleteModal = (product) => setDeleting(product);

  // `showLoading` is set when the page changes (or on first load) so the grid
  // shows skeletons; refreshing after an edit keeps the current cards.
  const fetchProducts = useCallback(async (page, { showLoading = false } = {}) => {
    const request = ++latestRequest.current;
    if (showLoading) setLoadingPage(true);
    try {
      const response = await fetch(
        `${API_URL}/products?page=${page}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { status, result: data } = await response.json();
      // A newer page was asked for while this one loaded.
      if (request !== latestRequest.current) return;

      // Deleting the only product of the last page leaves that page empty, so
      // step back to the one before it.
      if (status === 404 && page > 1) {
        setCurrentPage(page - 1);
        return;
      }
      // The session ended, usually because the 24-hour account was deleted.
      if (status === 401) {
        toast("Your session ended. Sign in again", { icon: "👋" });
        dispatch(logout());
        return;
      }
      if (status !== 200) {
        toast.error("Could not load the products");
        return;
      }

      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalProducts(data.count);
    } catch (err) {
      console.log(err);
    } finally {
      if (request === latestRequest.current) setLoadingPage(false);
    }
  }, [token, dispatch]);

  const paginateProps = { currentPage, totalPages, handlePageChange };
  const firstShown = totalProducts ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const lastShown = Math.min(currentPage * PAGE_SIZE, totalProducts);

  useEffect(() => {
    fetchProducts(currentPage, { showLoading: true });
  }, [currentPage, fetchProducts]);

  // Skeletons only appear if the page takes more than a moment, so fast
  // responses don't flash them.
  useEffect(() => {
    if (!loadingPage) {
      setShowSkeleton(false);
      return;
    }
    const timer = setTimeout(() => setShowSkeleton(true), 150);
    return () => clearTimeout(timer);
  }, [loadingPage]);

  // As many skeletons as products the page will hold, when that's known.
  const skeletonCount = totalProducts
    ? Math.min(PAGE_SIZE, totalProducts - (currentPage - 1) * PAGE_SIZE)
    : PAGE_SIZE;

  return (
    <>
      <div className={styles.mainWrapper}>
        <Sidebar />
        <main className={styles.content}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.header__title}>Products</h1>
              <p className={styles.header__subtitle}>
                {products ? `${totalProducts} products in the catalog` : "\u00a0"}
              </p>
            </div>
            <button
              className={styles.button__create}
              onClick={handleShowCreateModal}
            >
              <Plus size="16" /> New product
            </button>
          </header>
          {showSkeleton && (
            <div className={styles.grid} aria-busy="true" aria-label="Loading products">
              {Array.from({ length: skeletonCount }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}
          {!showSkeleton && products && products.length === 0 && (
            <div className={styles.empty}>
              <h2>Your catalog is empty</h2>
              <p>Create a product to get started.</p>
            </div>
          )}
          {products && products.length > 0 && (
            <>
              {!showSkeleton && (
                <div className={styles.grid}>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    handleShowEditModal={handleShowEditModal}
                    handleShowDeleteModal={handleShowDeleteModal}
                  />
                ))}
                </div>
              )}
              <div className={styles.table__info}>
                <small>
                  Showing {firstShown}–{lastShown} of {totalProducts}
                </small>
                <Paginate {...paginateProps} />
              </div>
            </>
          )}
        </main>
      </div>
      <ProductFormModal
        show={creating || Boolean(editing)}
        product={editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSubmit={editing ? handleProductUpdate : handleProductCreate}
      />
      <DeleteProductModal
        product={deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleProductDelete}
      />
    </>
  );
}

export default ProductList;
