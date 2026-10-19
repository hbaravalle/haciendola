import { Package, Power } from "feather-icons-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../../redux/authSlice";

import styles from "./Sidebar.module.scss";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(login({}));
    toast("Hope to see you soon!", {
      icon: "👋",
    });
    navigate("/login");
  };

  return (
    <div className={styles.sidebar}>
      <div>
        <a>
          <img
            src="/logo.png"
            alt="Haciéndola logo"
            className={styles.sidebar__logo}
          />
        </a>
        <nav className={styles.sidebar__nav}>
          <ul className={styles.sidebar__list}>
            <li className={styles.sidebar__itemTitle}>Secciones</li>
            <li className={styles.sidebar__item}>
              <a href="">
                <Package
                  size="16"
                  style={{
                    marginRight: "10px",
                    marginBottom: "-2px",
                  }}
                />
                Productos
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <button
        className={styles["sidebar__button--submit"]}
        onClick={handleLogout}
      >
        <Power /> Logout
      </button>
    </div>
  );
}

export default Sidebar;
