import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiHeart, FiMenu, FiX } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import styles from "./styles.module.css";

const navigationLinks = [
    { label: "Impact", to: "/", end: true },
    { label: "Donors", to: "/donors" },
    { label: "Campaigns", to: "/campaigns" },
    { label: "Gifts", to: "/gifts" },
];

const repositoryUrl = "https://github.com/a2rp/nonprofit-donor-management";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [headerHidden, setHeaderHidden] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const closeIfOutside = (event) => {
            if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        document.addEventListener("pointerdown", closeIfOutside);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeIfOutside);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [menuOpen]);

    useEffect(() => {
        let previousScrollY = window.scrollY;
        const updateHeaderVisibility = () => {
            const currentScrollY = window.scrollY;
            if (menuOpen || currentScrollY <= 8) setHeaderHidden(false);
            else if (currentScrollY > previousScrollY) setHeaderHidden(true);
            else if (currentScrollY < previousScrollY) setHeaderHidden(false);
            previousScrollY = currentScrollY;
        };
        window.addEventListener("scroll", updateHeaderVisibility, { passive: true });
        return () => window.removeEventListener("scroll", updateHeaderVisibility);
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className={styles.header} data-hidden={headerHidden} ref={headerRef}>
            <div className={styles.inner}>
                <NavLink aria-label="Kindred impact overview" className={styles.brand} end to="/">
                    <span aria-hidden="true" className={styles.brandMark}><FiHeart /></span>
                    <span>kindred<span className={styles.brandDot}>.</span></span>
                </NavLink>
                <button
                    aria-controls="primary-navigation"
                    aria-expanded={menuOpen}
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    className={styles.menuButton}
                    onClick={() => setMenuOpen((open) => !open)}
                    type="button"
                >
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>
                <nav aria-label="Main navigation" className={menuOpen ? styles.navigationOpen : styles.navigation} id="primary-navigation">
                    {navigationLinks.map((item) => (
                        <NavLink
                            className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                            end={item.end}
                            key={item.to}
                            onClick={closeMenu}
                            to={item.to}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                    <a className={styles.repositoryLink} href={repositoryUrl} rel="noreferrer" target="_blank">
                        <FaGithub aria-hidden="true" /> <span>Repository</span> <FiArrowUpRight aria-hidden="true" />
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
