import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const icons = { success: FiCheckCircle, error: FiAlertCircle, info: FiInfo };

const Toast = ({ toast, onClose }) => {
    if (!toast) return null;
    const Icon = icons[toast.type] || icons.info;
    return (
        <div aria-atomic="true" aria-live={toast.type === "error" ? "assertive" : "polite"} className={`${styles.toast} ${styles[toast.type] || styles.info}`} role="status">
            <Icon aria-hidden="true" className={styles.icon} />
            <div className={styles.copy}>
                <strong>{toast.title}</strong>
                {toast.message && <p>{toast.message}</p>}
            </div>
            <button aria-label="Dismiss notification" className={styles.dismiss} onClick={onClose} type="button"><FiX aria-hidden="true" /></button>
            <span aria-hidden="true" className={styles.timer} />
        </div>
    );
};

export default Toast;
