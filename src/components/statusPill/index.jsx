import styles from "./styles.module.css";

const StatusPill = ({ status, tone = "" }) => {
    const key = (tone || status || "neutral").toLowerCase().replace(/[^a-z]/g, "");
    return <span className={`${styles.pill} ${styles[key] || styles.neutral}`}>{status}</span>;
};

export default StatusPill;
