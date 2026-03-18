import { Link } from "@tanstack/react-router";
import styles from "./NavBar.module.css";

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <span className={styles.logo}>
        Board<span>Art</span>
      </span>
      <div className={styles.links}>
        <Link to="/" className={styles.link} activeOptions={{ exact: true }}>
          Dashboard
        </Link>
        <Link to="/library" className={styles.link}>
          Library
        </Link>
        <Link to="/sleeving" className={styles.link}>
          Sleeving
        </Link>
        <Link to="/prints" className={styles.link}>
          3D Prints
        </Link>
      </div>
      <Link to="/user" className={styles.userIcon}>
        <UserIcon />
      </Link>
    </nav>
  );
}
