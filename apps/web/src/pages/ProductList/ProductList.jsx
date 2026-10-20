import { useEffect, useState } from "react";
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
import {
  errorMessage,
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../redux/api";

// Runs a change and toasts the result. Resolves to true so the modal closes.
async function send(request, successMessage) {
  try {
    await request.unwrap();
    toast.success(successMessage);
    return true;
  } catch (error) {
    // On 401, redux/api.js already signed out.
    if (error?.status !== 401) toast.error(errorMessage(error));
    return false;
  }
}

function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showSkeleton, setShowSkeleton] = useState(false);

  // `data` keeps the last page on screen while the next one loads.
  const { data, currentData, isFetching, error } = useGetProductsQuery(currentPage);
  const products = data?.products ?? null;
  const totalPages = data?.totalPages ?? 1;
  const totalProducts = data?.count ?? 0;
  const loadingPage = isFetching && !currentData;

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Which modal is open, and for which product.
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const handleProductCreate = async (values) => {
    const created = await send(createProduct(values), "Product created");
    if (created) setCreating(false);
    return created;
  };

  const handleProductUpdate = async (values) => {
    const updated = await send(
      updateProduct({ sku: editing.sku, changes: values }),
      "Product updated"
    );
    if (updated) setEditing(null);
    return updated;
  };

  const handleProductDelete = async (product) => {
    const deleted = await send(deleteProduct(product.sku), "Product deleted");
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

  const paginateProps = { currentPage, totalPages, handlePageChange };
  const firstShown = totalProducts ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const lastShown = Math.min(currentPage * PAGE_SIZE, totalProducts);

  useEffect(() => {
    if (!error) return;
    // The last page emptied after a delete: step back.
    if (error.status === 404 && currentPage > 1) {
      setCurrentPage((page) => page - 1);
      return;
    }
    // On 401, redux/api.js already signed out.
    if (error.status !== 401) toast.error("Could not load the products");
  }, [error, currentPage]);

  // Skeletons only if loading takes over 150 ms.
  useEffect(() => {
    if (!loadingPage) {
      setShowSkeleton(false);
      return;
    }
    const timer = setTimeout(() => setShowSkeleton(true), 150);
    return () => clearTimeout(timer);
  }, [loadingPage]);

  // As many skeletons as the page will hold.
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
