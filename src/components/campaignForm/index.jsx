import { useState } from "react";
import Button from "../button/index.jsx";
import styles from "./styles.module.css";

const programs = ["Food access", "Youth learning", "Community care", "Neighborhood garden", "Health access", "General support"];

const CampaignForm = ({ initialValues, onSubmit, submitLabel }) => {
    const [form, setForm] = useState(() => ({
        name: initialValues?.name || "",
        program: initialValues?.program || programs[0],
        goal: initialValues?.goal ? String(initialValues.goal) : "",
        endDate: initialValues?.endDate || "",
        description: initialValues?.description || "",
    }));
    const [error, setError] = useState("");

    const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

    const submit = (event) => {
        event.preventDefault();
        const goal = Number(form.goal);
        if (form.name.trim().length < 3) return setError("Give the campaign a name with at least three characters.");
        if (!Number.isFinite(goal) || goal < 1) return setError("Enter a fundraising goal greater than zero.");
        if (!form.endDate) return setError("Choose a campaign end date.");
        setError("");
        onSubmit({ ...form, name: form.name.trim(), goal, description: form.description.trim() });
    };

    return (
        <form className={styles.form} noValidate onSubmit={submit}>
            <div className={styles.grid}>
                <label>Campaign name<input maxLength="72" name="name" onChange={update} placeholder="e.g. Neighbourhood meal fund" value={form.name} /></label>
                <label>Program area<select name="program" onChange={update} value={form.program}>{programs.map((program) => <option key={program}>{program}</option>)}</select></label>
                <label>Fundraising goal<input inputMode="decimal" min="1" name="goal" onChange={update} placeholder="15000" type="number" value={form.goal} /></label>
                <label>Campaign end date<input name="endDate" onChange={update} type="date" value={form.endDate} /></label>
                <label className={styles.full}>Campaign story<textarea maxLength="260" name="description" onChange={update} placeholder="What community need will this campaign support?" rows="3" value={form.description} /></label>
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <div className={styles.actions}><span>Campaign details stay in this session.</span><Button type="submit" variant="primary">{submitLabel}</Button></div>
        </form>
    );
};

export default CampaignForm;
