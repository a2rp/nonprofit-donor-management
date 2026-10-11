import { useState } from "react";
import { FiArrowLeft, FiArrowUpRight, FiCalendar, FiHeart, FiMail, FiMapPin, FiMessageCircle, FiPhone, FiTrash2, FiUser } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button/index.jsx";
import DonorForm from "../../components/donorForm/index.jsx";
import Modal from "../../components/modal/index.jsx";
import StatusPill from "../../components/statusPill/index.jsx";
import { formatCurrency, formatDate, getDonorName, getInitials } from "../../utils/format.js";
import styles from "./styles.module.css";

const DonorProfile = ({ donors, gifts, campaigns, onUpdateDonor, onDeleteDonor, onAddTouchpoint }) => {
    const { donorId } = useParams();
    const navigate = useNavigate();
    const donor = donors.find((item) => item.id === donorId);
    const [dialog, setDialog] = useState("");
    const [touchpoint, setTouchpoint] = useState({ kind: "Thank-you call", date: new Date().toISOString().slice(0, 10), summary: "" });
    const [touchpointError, setTouchpointError] = useState("");
    if (!donor) return <main className={styles.notFound}><span><FiUser aria-hidden="true" /></span><h1>This donor file is not available.</h1><p>The record may have been removed during this session.</p><Link to="/donors"><FiArrowLeft aria-hidden="true" /> Return to donors</Link></main>;

    const donorGifts = gifts.filter((gift) => gift.donorId === donor.id).sort((first, second) => second.date.localeCompare(first.date));
    const lifetimeGiving = donorGifts.reduce((sum, gift) => sum + gift.amount, 0);
    const lastTouchpoint = [...donor.touchpoints].sort((first, second) => second.date.localeCompare(first.date))[0];

    const saveDonor = (draft) => {
        onUpdateDonor(donor.id, draft);
        setDialog("");
    };

    const saveTouchpoint = (event) => {
        event.preventDefault();
        if (touchpoint.summary.trim().length < 8) {
            setTouchpointError("Add a brief note of at least 8 characters.");
            return;
        }
        onAddTouchpoint(donor.id, { ...touchpoint, summary: touchpoint.summary.trim() });
        setTouchpoint({ kind: "Thank-you call", date: new Date().toISOString().slice(0, 10), summary: "" });
        setTouchpointError("");
        setDialog("");
    };

    const removeDonor = () => {
        onDeleteDonor(donor.id);
        setDialog("");
        navigate("/donors");
    };

    return (
        <main className={styles.page}>
            <Link className={styles.backLink} to="/donors"><FiArrowLeft aria-hidden="true" /> Donor book</Link>
            <section className={styles.profileHero}>
                <div className={styles.identity}>
                    <span className={styles.avatar}>{getInitials(donor)}</span>
                    <div><span className={styles.donorId}>DONOR FILE / {donor.id}</span><h1>{getDonorName(donor)}</h1><StatusPill status={donor.segment} /><p><FiMapPin aria-hidden="true" /> {donor.city || "Area not added"} <i /> <FiCalendar aria-hidden="true" /> Connected since {formatDate(donor.joinedOn, { month: "long", year: "numeric" })}</p></div>
                </div>
                <div className={styles.heroActions}>
                    <Button icon={<FiMessageCircle />} onClick={() => setDialog("touchpoint")}>Log a touchpoint</Button>
                    <Button onClick={() => setDialog("edit")}>Edit profile</Button>
                    <button aria-label={`Remove ${getDonorName(donor)}`} className={styles.deleteButton} onClick={() => setDialog("delete")} title="Remove donor" type="button"><FiTrash2 aria-hidden="true" /></button>
                </div>
            </section>

            <section className={styles.metrics} aria-label="Donor giving summary">
                <article><span className={styles.metricIcon}><FiHeart aria-hidden="true" /></span><div><small>Lifetime giving</small><strong>{formatCurrency(lifetimeGiving)}</strong></div></article>
                <article><span className={styles.metricIcon}><FiCalendar aria-hidden="true" /></span><div><small>Gifts recorded</small><strong>{donorGifts.length}</strong></div></article>
                <article><span className={styles.metricIcon}><FiMessageCircle aria-hidden="true" /></span><div><small>Last relationship note</small><strong>{lastTouchpoint ? formatDate(lastTouchpoint.date, { month: "short", day: "numeric" }) : "Not yet"}</strong></div></article>
            </section>

            <section className={styles.contentGrid}>
                <div className={styles.givingPanel}>
                    <div className={styles.panelHeading}><div><span className={styles.context}>A RECORD OF GENEROSITY</span><h2>Giving history</h2></div><Link to="/gifts">Open all gifts <FiArrowUpRight aria-hidden="true" /></Link></div>
                    <div className={styles.giftTimeline}>
                        {donorGifts.map((gift) => {
                            const campaign = campaigns.find((item) => item.id === gift.campaignId);
                            return <article className={styles.giftRow} key={gift.id}>
                                <span className={styles.giftIcon}><FiHeart aria-hidden="true" /></span>
                                <div className={styles.giftDetails}><strong>{campaign?.name || "Unassigned campaign"}</strong><span>{formatDate(gift.date)} · {gift.method}{gift.recurring ? " · Monthly" : ""}</span>{gift.note && <small>{gift.note}</small>}</div>
                                <div className={styles.giftAmount}><strong>{formatCurrency(gift.amount)}</strong><StatusPill status={gift.acknowledged ? "Acknowledged" : "Needs thanks"} /></div>
                            </article>;
                        })}
                        {!donorGifts.length && <div className={styles.emptyHistory}><FiHeart aria-hidden="true" /><strong>No gifts recorded yet</strong><span>New gifts linked to this donor will appear here.</span><Link to="/gifts">Record a gift <FiArrowUpRight aria-hidden="true" /></Link></div>}
                    </div>
                </div>

                <aside className={styles.relationshipPanel}>
                    <div className={styles.panelHeading}><div><span className={styles.context}>THE HUMAN DETAILS</span><h2>Relationship notes</h2></div><FiUser aria-hidden="true" /></div>
                    <div className={styles.contactCard}>
                        <a href={`mailto:${donor.email}`}><FiMail aria-hidden="true" /><span>{donor.email}</span><FiArrowUpRight aria-hidden="true" /></a>
                        {donor.phone && <a href={`tel:${donor.phone}`}><FiPhone aria-hidden="true" /><span>{donor.phone}</span><FiArrowUpRight aria-hidden="true" /></a>}
                        <div className={styles.preferredContact}><span>Preferred contact</span><strong>{donor.preferredChannel}</strong></div>
                    </div>
                    <p className={styles.personalNote}>{donor.note || "No personal note has been added yet."}</p>
                    <div className={styles.interests}><span className={styles.context}>INTERESTS</span><div>{donor.interests.length ? donor.interests.map((interest) => <span key={interest}>{interest}</span>) : <small>No interests added.</small>}</div></div>
                    <div className={styles.activityHeading}><span className={styles.context}>STEWARDSHIP TIMELINE</span><button onClick={() => setDialog("touchpoint")} type="button">Add note <FiArrowUpRight aria-hidden="true" /></button></div>
                    <div className={styles.touchpoints}>
                        {donor.touchpoints.map((item) => <article className={styles.touchpoint} key={item.id}>
                            <span className={styles.timelineDot}><FiMessageCircle aria-hidden="true" /></span>
                            <div><div><strong>{item.kind}</strong><time>{formatDate(item.date, { month: "short", day: "numeric" })}</time></div><p>{item.summary}</p></div>
                        </article>)}
                        {!donor.touchpoints.length && <p className={styles.emptyTimeline}>Record a call, visit, or update to start this timeline.</p>}
                    </div>
                </aside>
            </section>

            <Modal description="Update the contact and relationship details kept for this donor." onClose={() => setDialog("")} open={dialog === "edit"} title={`Edit ${getDonorName(donor)}`}>
                <DonorForm initialValues={donor} onSubmit={saveDonor} submitLabel="Save profile" />
            </Modal>
            <Modal description="Add a brief record of a call, visit, invitation, or program update. This does not send a message." onClose={() => { setDialog(""); setTouchpointError(""); }} open={dialog === "touchpoint"} title="Log a donor touchpoint">
                <form className={styles.touchForm} noValidate onSubmit={saveTouchpoint}>
                    <label>Touchpoint type<select onChange={(event) => setTouchpoint((current) => ({ ...current, kind: event.target.value }))} value={touchpoint.kind}>{["Thank-you call", "Program update", "Event invitation", "Volunteer check-in", "Grant update", "Email note", "Visit"].map((kind) => <option key={kind}>{kind}</option>)}</select></label>
                    <label>Date<input onChange={(event) => setTouchpoint((current) => ({ ...current, date: event.target.value }))} type="date" value={touchpoint.date} /></label>
                    <label>What happened?<textarea maxLength="300" onChange={(event) => setTouchpoint((current) => ({ ...current, summary: event.target.value }))} placeholder="Add a helpful detail for the next conversation" rows="4" value={touchpoint.summary} /></label>
                    {touchpointError && <p role="alert">{touchpointError}</p>}
                    <div className={styles.formActions}><Button onClick={() => setDialog("")}>Cancel</Button><Button type="submit" variant="primary">Save note</Button></div>
                </form>
            </Modal>
            <Modal actions={<><Button onClick={() => setDialog("")}>Keep donor</Button><Button onClick={removeDonor} variant="danger">Remove donor</Button></>} description="This removes the contact details and keeps gift totals without linking them to this donor." onClose={() => setDialog("")} open={dialog === "delete"} title="Remove this donor?">
                <div className={styles.confirmContent}><FiTrash2 aria-hidden="true" /><p><strong>{getDonorName(donor)}</strong>'s personal contact details will be removed from this session.</p></div>
            </Modal>
        </main>
    );
};

export default DonorProfile;
