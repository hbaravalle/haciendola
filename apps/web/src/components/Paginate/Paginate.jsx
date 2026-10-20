import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "feather-icons-react";
import styles from "./Paginate.module.scss";

function Paginate({ handlePageChange, currentPage, totalPages }) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav className={styles.paginate} aria-label="Pagination">
      <button
        onClick={() => handlePageChange(1)}
        className={styles.paginate__button}
        disabled={isFirst}
        aria-label="First page"
      >
        <ChevronsLeft size="13" />
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className={styles.paginate__button}
        disabled={isFirst}
        aria-label="Previous page"
      >
        <ChevronLeft size="13" />
      </button>
      <span className={styles.paginate__current} aria-current="page">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className={styles.paginate__button}
        disabled={isLast}
        aria-label="Next page"
      >
        <ChevronRight size="13" />
      </button>
      <button
        onClick={() => handlePageChange(totalPages)}
        className={styles.paginate__button}
        disabled={isLast}
        aria-label="Last page"
      >
        <ChevronsRight size="13" />
      </button>
    </nav>
  );
}

export default Paginate;
