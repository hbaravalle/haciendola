import { Package, Power } from "feather-icons-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../../redux/authSlice";

import { DEMO_EMAIL } from "@haciendola/shared";
import styles from "./Sidebar.module.scss";

const time = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

// "today at 3:45 PM" or "tomorrow at 9:10 AM": accounts last 24 hours.
function formatDeletion(iso) {
  const date = new Date(iso);
  const day = date.toDateString() === new Date().toDateString() ? "today" : "tomorrow";
  return `${day} at ${time.format(date)}`;
}

function Sidebar() {
  const email = useSelector((state) => state.auth.email);
  const accountExpiresAt = useSelector((state) => state.auth.accountExpiresAt);
  const isDemo = email === DEMO_EMAIL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast("Hope to see you soon!", {
      icon: "👋",
    });
    navigate("/login");
  };

  return (
    <div className={styles.sidebar}>
      <div>
        <img
          src="/logo.png"
          alt="Haciéndola logo"
          className={styles.sidebar__logo}
        />
        <nav className={styles.sidebar__nav}>
          <ul className={styles.sidebar__list}>
            <li className={styles.sidebar__itemTitle}>Sections</li>
            <li className={styles.sidebar__item}>
              <NavLink to="/" end>
                <Package size="16" />
                Products
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <div className={styles.sidebar__account}>
          {isDemo ? (
            <>
              <strong>Demo account</strong>
              <span>Shared catalog, resets daily</span>
            </>
          ) : (
            <>
              <span>Signed in as</span>
              <strong title={email}>{email}</strong>
              {accountExpiresAt && (
                <span>Deleted {formatDeletion(accountExpiresAt)}</span>
              )}
            </>
          )}
        </div>
        <button
          className={styles["sidebar__button--submit"]}
          onClick={handleLogout}
        >
          <Power size="16" /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
