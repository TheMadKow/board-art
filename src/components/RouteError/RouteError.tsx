import styles from "./RouteError.module.css";

interface RouteErrorProps {
  error: Error;
}

export default function RouteError({ error }: RouteErrorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Something went wrong</div>
      <div className={styles.message}>{error.message}</div>
    </div>
  );
}
