import styles from "./FormLayout.module.scss";

function FormLayout({ children }) {
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.formLayout}>
        <div className={styles.formLayout__logo}>
          <img src="/logo.png" alt="Haciéndola logo" />
        </div>
        {children}
      </div>
    </div>
  );
}

export default FormLayout;
