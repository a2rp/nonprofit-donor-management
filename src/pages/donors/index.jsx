import { useMemo, useState } from "react";
import { FiArrowUpRight, FiHeart, FiMail, FiMapPin, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../../components/button/index.jsx";
import DonorForm from "../../components/donorForm/index.jsx";
import Modal from "../../components/modal/index.jsx";
import StatusPill from "../../components/statusPill/index.jsx";
import { donorSegments } from "../../data/seed.js";
import { formatCurrency, formatDate, getDonorName, getInitials } from "../../utils/format.js";
import styles from "./styles.module.css";

const Donors = ({ donors, gifts, onCreateDonor, onUpdateDonor, onDeleteDonor }) => {
    const [search, setSearch] = useState("");
    const [segmentFilter, setSegmentFilter] = useState("All relationships");
    const [sort, setSort] = useState("name");
    const [dialog, setDialog] = useState(null);
    const filteredDonors = useMemo(() => donors.filter((donor) => {
        const query = search.toLowerCase().trim();
        const matchesSearch = !query || `${getDonorName(donor)} ${donor.email} ${donor.city} ${donor.id}`.toLowerCase().includes(query);
        const matchesSegment = segmentFilter === "All relationships" || donor.segment === segmentFilter;
        return matchesSearch && matchesSegment;
    }).sort((first, second) => {
        if (sort === "giving") return gifts.filter((gift) => gift.donorId === second.id).reduce((sum, gift) => sum + gift.amount, 0) - gifts.filter((gift) => gift.donorId === first.id).reduce((sum, gift) => sum + gift.amount, 0);
        if (sort === "recent") return second.joinedOn.localeCompare(first.joinedOn);
        return getDonorName(first).localeCompare(getDonorName(second));
    }), [donors, gifts, search, segmentFilter, sort]);

    const saveDonor = (draft) => {
        if (dialog.mode === "edit") onUpdateDonor(dialog.donor.id, draft);
        else onCreateDonor(draft);
        setDialog(null);
    };

    const removeDonor = () => {
        onDeleteDonor(dialog.donor.id);
        setDialog(null);
    };

    const clearFilters = () => {
        setSearch("");
        setSegmentFilter("All relationships");
        setSort("name");
    };

    return (
        <main className={styles.page}>
            <section className={styles.pageHeading}>
                <div><span className={styles.context}>RELATIONSHIP BOOK / DONORS</span><h1>People who move the mission.</h1><p>A clear place for the names, interests, and moments behind each gift.</p></div>
                <Button icon={<FiPlus />} onClick={() => setDialog({ mode: "create" })} variant="primary">Add donor</Button>
            </section>

            <section className={styles.directoryIntro}>
                <div className={styles.directoryMark}><FiUsers aria-hidden="true" /></div>
                <p><strong>Your relationship book</strong><span>Keep a useful record of each supporter and their giving history.</span></p>
                <strong className={styles.directoryCount}>{donors.length} people</strong>
            </section>

            <section className={styles.toolbar} aria-label="Donor search and filters">
                <label className={styles.searchBox}><FiSearch aria-hidden="true" /><span className={styles.srOnly}>Search donors</span><input onChange={(event) => setSearch(event.target.value)} placeholder="Find a name, email, area, or ID" value={search} /></label>
                <label className={styles.selectField}><span>Relationship</span><select onChange={(event) => setSegmentFilter(event.target.value)} value={segmentFilter}><option>All relationships</option>{donorSegments.map((segment) => <option key={segment}>{segment}</option>)}</select></label>
                <label className={styles.selectField}><span>Sort by</span><select onChange={(event) => setSort(event.target.value)} value={sort}><option value="name">Name, A to Z</option><option value="giving">Giving, highest first</option><option value="recent">Recently added</option></select></label>
                {(search || segmentFilter !== "All relationships") && <button className={styles.clearButton} onClick={clearFilters} type="button">Clear filters</button>}
            </section>
            <div aria-live="polite" className={styles.resultsLine}><span>{filteredDonors.length} matching {filteredDonors.length === 1 ? "donor" : "donors"}</span><span>Changes update the current session only.</span></div>

            {filteredDonors.length ? <section className={styles.donorGrid} aria-label="Donor records">
                {filteredDonors.map((donor, index) => {
                    const donorGifts = gifts.filter((gift) => gift.donorId === donor.id);
                    const total = donorGifts.reduce((sum, gift) => sum + gift.amount, 0);
                    const latestGift = [...donorGifts].sort((first, second) => second.date.localeCompare(first.date))[0];
                    return <article className={styles.donorCard} key={donor.id}>
                        <div className={`${styles.cardTop} ${styles[`cardTop${index % 4}`]}`}>
                            <span className={styles.avatar}>{getInitials(donor)}</span>
                            <span className={styles.donorId}>{donor.id}</span>
                            <button aria-label={`Remove ${getDonorName(donor)}`} className={styles.removeButton} onClick={() => setDialog({ mode: "delete", donor })} title="Remove donor" type="button"><FiTrash2 aria-hidden="true" /></button>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.nameBlock}><h2>{getDonorName(donor)}</h2><StatusPill status={donor.segment} /></div>
                            <p className={styles.donorNote}>{donor.note || "No relationship note yet."}</p>
                            <div className={styles.contactLine}><FiMail aria-hidden="true" /><span>{donor.email}</span></div>
                            <div className={styles.contactLine}><FiMapPin aria-hidden="true" /><span>{donor.city || "Area not added"}</span></div>
                            <div className={styles.interests}>{donor.interests.slice(0, 2).map((interest) => <span key={interest}>{interest}</span>)}</div>
                            <div className={styles.givingSummary}>
                                <div><span><FiHeart aria-hidden="true" /> Lifetime giving</span><strong>{formatCurrency(total)}</strong></div>
                                <div><span>{donorGifts.length} {donorGifts.length === 1 ? "gift" : "gifts"}</span><small>{latestGift ? `Latest ${formatDate(latestGift.date, { month: "short", day: "numeric" })}` : "No gifts recorded"}</small></div>
                            </div>
                            <div className={styles.cardActions}>
                                <Link className={styles.profileLink} to={`/donors/${donor.id}`}>Open donor file <FiArrowUpRight aria-hidden="true" /></Link>
                                <button className={styles.editButton} onClick={() => setDialog({ mode: "edit", donor })} type="button">Edit</button>
                            </div>
                        </div>
                    </article>;
                })}
            </section> : <section className={styles.emptyState}>
                <span><FiSearch aria-hidden="true" /></span><h2>No donors match that search.</h2><p>Try another name or clear your filters to return to the relationship book.</p><Button onClick={clearFilters}>Clear filters</Button>
            </section>}

            <Modal
                description={dialog?.mode === "delete" ? "The contact record is removed from this session. Gift amounts and campaign totals are kept without the donor's personal details." : "Record the details your team needs to build a thoughtful relationship."}
                onClose={() => setDialog(null)}
                open={dialog?.mode === "create" || dialog?.mode === "edit"}
                title={dialog?.mode === "edit" ? `Edit ${getDonorName(dialog.donor)}` : "Add a donor"}
            >
                <DonorForm initialValues={dialog?.donor} onSubmit={saveDonor} submitLabel={dialog?.mode === "edit" ? "Save donor" : "Add donor"} />
            </Modal>
            <Modal
                actions={<><Button onClick={() => setDialog(null)}>Keep donor</Button><Button onClick={removeDonor} variant="danger">Remove donor</Button></>}
                description="Gift amounts stay in the ledger and campaign totals. The gifts become unlinked from this contact record."
                onClose={() => setDialog(null)}
                open={dialog?.mode === "delete"}
                title="Remove this donor?"
            >
                <div className={styles.confirmContent}><FiTrash2 aria-hidden="true" /><p><strong>{dialog?.donor && getDonorName(dialog.donor)}</strong> and the personal contact details will be removed from this session.</p></div>
            </Modal>
        </main>
    );
};

export default Donors;
