import { useState } from "react";
import { donorSegments } from "../../data/seed.js";
import styles from "./styles.module.css";

const DonorForm = ({ initialValues, onSubmit, submitLabel }) => {
    const [form, setForm] = useState(() => ({
        firstName: initialValues?.firstName || "",
        lastName: initialValues?.lastName || "",
        email: initialValues?.email || "",
        phone: initialValues?.phone || "",
        city: initialValues?.city || "",
        segment: initialValues?.segment || donorSegments[1],
        preferredChannel: initialValues?.preferredChannel || "Email",
        interests: initialValues?.interests?.join(", ") || "",
        note: initialValues?.note || "",
    }));
    const [error, setError] = useState("");

    const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

    const submit = (event) => {
        event.preventDefault();
        if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
            setError("Enter the donor's first name, last name, and email address.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            setError("Enter a valid email address.");
            return;
        }
        onSubmit({
            ...form,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            interests: form.interests.split(",").map((item) => item.trim()).filter(Boolean),
        });
    };

    return (
        <form className={styles.form} noValidate onSubmit={submit}>
            <div className={styles.grid}>
                <label className={styles.field}>First name<input autoComplete="given-name" name="firstName" onChange={update} value={form.firstName} /></label>
                <label className={styles.field}>Last name<input autoComplete="family-name" name="lastName" onChange={update} value={form.lastName} /></label>
                <label className={styles.field}>Email address<input autoComplete="email" inputMode="email" name="email" onChange={update} value={form.email} /></label>
                <label className={styles.field}>Phone number<input autoComplete="tel" inputMode="tel" name="phone" onChange={update} value={form.phone} /></label>
                <label className={styles.field}>City or area<input autoComplete="address-level2" name="city" onChange={update} value={form.city} /></label>
                <label className={styles.field}>Relationship<select name="segment" onChange={update} value={form.segment}>{donorSegments.map((segment) => <option key={segment}>{segment}</option>)}</select></label>
                <label className={styles.field}>Preferred contact<select name="preferredChannel" onChange={update} value={form.preferredChannel}>{["Email", "Phone", "Text", "Mail"].map((channel) => <option key={channel}>{channel}</option>)}</select></label>
                <label className={styles.field}>Interests <span className={styles.helper}>Separate with commas</span><input name="interests" onChange={update} placeholder="Food access, youth learning" value={form.interests} /></label>
                <label className={`${styles.field} ${styles.full}`}>Relationship notes<textarea maxLength="360" name="note" onChange={update} placeholder="What would help your team build a thoughtful relationship?" rows="3" value={form.note} /></label>
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <div className={styles.submitRow}><span>Contact details stay in this session.</span><button className={styles.submit} type="submit">{submitLabel}</button></div>
        </form>
    );
};

export default DonorForm;
