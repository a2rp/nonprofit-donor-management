import { useState } from "react";
import { giftMethods } from "../../data/seed.js";
import { getDonorName } from "../../utils/format.js";
import Button from "../button/index.jsx";
import styles from "./styles.module.css";

const GiftForm = ({ initialValues, donors, campaigns, onSubmit, submitLabel }) => {
    const [form, setForm] = useState(() => ({
        donorId: initialValues?.donorId || "",
        campaignId: initialValues?.campaignId || "",
        amount: initialValues?.amount ? String(initialValues.amount) : "",
        date: initialValues?.date || new Date().toISOString().slice(0, 10),
        method: initialValues?.method || giftMethods[0],
        note: initialValues?.note || "",
    }));
    const [error, setError] = useState("");
    const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

    const submit = (event) => {
        event.preventDefault();
        const amount = Number(form.amount);
        if (!Number.isFinite(amount) || amount <= 0) return setError("Enter a gift amount greater than zero.");
        if (!form.date) return setError("Choose the date the gift was received.");
        setError("");
        onSubmit({ ...form, amount, note: form.note.trim() });
    };

    return (
        <form className={styles.form} noValidate onSubmit={submit}>
            <div className={styles.grid}>
                <label>Supporter<select name="donorId" onChange={update} value={form.donorId}><option value="">Anonymous / unlinked</option>{donors.map((donor) => <option key={donor.id} value={donor.id}>{getDonorName(donor)}</option>)}</select></label>
                <label>Campaign<select name="campaignId" onChange={update} value={form.campaignId}><option value="">No campaign</option>{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}{campaign.status === "Archived" ? " (archived)" : ""}</option>)}</select></label>
                <label>Gift amount<input inputMode="decimal" min="0.01" name="amount" onChange={update} placeholder="250" step="0.01" type="number" value={form.amount} /></label>
                <label>Date received<input name="date" onChange={update} type="date" value={form.date} /></label>
                <label>Giving method<select name="method" onChange={update} value={form.method}>{giftMethods.map((method) => <option key={method}>{method}</option>)}</select></label>
                <label className={styles.full}>Internal note<textarea maxLength="220" name="note" onChange={update} placeholder="Add a useful detail for the giving record" rows="3" value={form.note} /></label>
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <div className={styles.actions}><span>Recording a gift does not process a payment.</span><Button type="submit" variant="primary">{submitLabel}</Button></div>
        </form>
    );
};

export default GiftForm;
