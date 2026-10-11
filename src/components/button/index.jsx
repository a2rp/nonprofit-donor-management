import styles from "./styles.module.css";

const Button = ({ children, icon, variant = "outline", type = "button", className = "", ...props }) => (
    <button className={`${styles.button} ${styles[variant] || styles.outline} ${className}`.trim()} type={type} {...props}>
        {icon && <span aria-hidden="true" className={styles.icon}>{icon}</span>}
        <span>{children}</span>
    </button>
);

export default Button;
