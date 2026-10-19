import styles from "./FormLayout.module.scss";
import { useParams } from "react-router-dom";

function FormLayout({ children }) {
  const { step } = useParams();

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
