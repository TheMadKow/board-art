import { Link } from '@tanstack/react-router'
import styles from './NavBar.module.css'

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
    </nav>
  )
}
