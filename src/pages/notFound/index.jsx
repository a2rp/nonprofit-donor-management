import { FiArrowLeft, FiHeart, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const NotFound = () => (
    <main className={styles.page}>
        <div className={styles.mark}><FiHeart aria-hidden="true" /></div>
        <span className={styles.eyebrow}>A SMALL DETOUR</span>
        <h1>This page isn't in the giving book.</h1>
        <p>The address may have changed. Return to your community overview or open the donor relationship book.</p>
        <div className={styles.actions}>
            <Link className={styles.primaryLink} to="/"><FiArrowLeft aria-hidden="true" /> Back to impact</Link>
            <Link className={styles.secondaryLink} to="/donors"><FiUsers aria-hidden="true" /> Browse donors</Link>
        </div>
    </main>
);

export default NotFound;
