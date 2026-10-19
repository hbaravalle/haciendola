import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "feather-icons-react";
import styles from "./Paginate.module.scss";

function Paginate({ handlePageChange, currentPage, totalPages }) {
  return (
    <div className={styles.paginate}>
      <button
        onClick={() => handlePageChange(currentPage - 2)}
        className={styles.paginate__button}
      >
        <ChevronsLeft size="13" />
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className={styles.paginate__button}
      >
        <ChevronLeft size="13" />
      </button>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className={styles.paginate__button}
      >
        <ChevronRight size="13" />
      </button>
      <button
        onClick={() => handlePageChange(currentPage + 2)}
        className={styles.paginate__button}
      >
        <ChevronsRight size="13" />
      </button>
    </div>
  );
}

export default Paginate;
