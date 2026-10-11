import { useMemo, useState } from "react";
import { FiArrowDownRight, FiArrowUpRight, FiCheck, FiEdit2, FiFilter, FiGift, FiHeart, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../../components/button/index.jsx";
import GiftForm from "../../components/giftForm/index.jsx";
import Modal from "../../components/modal/index.jsx";
import StatusPill from "../../components/statusPill/index.jsx";
import { formatCompactCurrency, formatCurrency, formatDate, getDonorName, getInitials } from "../../utils/format.js";
import styles from "./styles.module.css";

const Gifts = ({ gifts, donors, campaigns, onCreateGift, onUpdateGift, onDeleteGift, onToggleAcknowledgment }) => {
    const [search, setSearch] = useState("");
    const [campaignFilter, setCampaignFilter] = useState("all");
    const [thanksFilter, setThanksFilter] = useState("all");
    const [sort, setSort] = useState("recent");
    const [dialog, setDialog] = useState(null);

    const visibleGifts = useMemo(() => gifts.filter((gift) => {
        const donor = donors.find((item) => item.id === gift.donorId);
        const campaign = campaigns.find((item) => item.id === gift.campaignId);
        const query = search.trim().toLowerCase();
        const matchesSearch = !query || [gift.id, getDonorName(donor), campaign?.name || "", gift.note || "", gift.method].join(" ").toLowerCase().includes(query);
        const matchesCampaign = campaignFilter === "all" || gift.campaignId === campaignFilter;
        const matchesThanks = thanksFilter === "all" || (thanksFilter === "pending" ? !gift.acknowledged : gift.acknowledged);
        return matchesSearch && matchesCampaign && matchesThanks;
    }).sort((first, second) => {
        if (sort === "oldest") return first.date.localeCompare(second.date);
        if (sort === "largest") return second.amount - first.amount;
        return second.date.localeCompare(first.date);
    }), [campaignFilter, campaigns, donors, gifts, search, sort, thanksFilter]);

    const totalGiving = gifts.reduce((sum, gift) => sum + gift.amount, 0);
    const needsThanks = gifts.filter((gift) => !gift.acknowledged).length;
    const monthlyGiving = gifts.filter((gift) => gift.method === "Monthly").reduce((sum, gift) => sum + gift.amount, 0);
    const closeDialog = () => setDialog(null);

    const saveGift = (draft) => {
        if (dialog.mode === "edit") onUpdateGift(dialog.gift.id, draft);
        else onCreateGift(draft);
        closeDialog();
    };

    const removeGift = () => {
        onDeleteGift(dialog.gift.id);
        closeDialog();
    };

    const clearFilters = () => {
        setSearch("");
        setCampaignFilter("all");
        setThanksFilter("all");
        setSort("recent");
    };

    const showPendingThanks = () => {
        setThanksFilter("pending");
        document.getElementById("gift-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <main className={styles.page}>
            <section className={styles.heading}>
                <div><span className={styles.context}>GIVING RECORD / THE LEDGER</span><h1>Every gift has a story.</h1><p>Keep contributions, their campaign purpose, and the follow-up they deserve in one clear record.</p></div>
                <Button icon={<FiPlus />} onClick={() => setDialog({ mode: "create" })} variant="primary">Record a gift</Button>
            </section>

            <section className={styles.ledgerSummary} aria-label="Giving record totals">
                <article className={styles.totalCard}><span className={styles.totalIcon}><FiGift aria-hidden="true" /></span><div><span>GIVING RECORDED</span><strong>{formatCompactCurrency(totalGiving)}</strong><small>{gifts.length} gifts in this session</small></div><i className={styles.totalShape} /></article>
                <article><span className={styles.smallIcon + " " + styles.coral}><FiHeart aria-hidden="true" /></span><div><span>THANKS TO PREPARE</span><strong>{needsThanks}</strong><small>Follow-up notes still pending</small></div><button aria-label="Filter gifts needing thanks" className={styles.jumpButton} onClick={showPendingThanks} type="button"><FiArrowDownRight aria-hidden="true" /></button></article>
                <article><span className={styles.smallIcon + " " + styles.gold}><FiArrowUpRight aria-hidden="true" /></span><div><span>MONTHLY GIFTS</span><strong>{formatCompactCurrency(monthlyGiving)}</strong><small>Marked as recurring support</small></div><span className={styles.metricEnd}>{gifts.filter((gift) => gift.method === "Monthly").length} records</span></article>
            </section>

            <section className={styles.filterPanel} aria-label="Giving record filters">
                <div className={styles.filterTitle}><span><FiFilter aria-hidden="true" /></span><div><strong>Find a gift</strong><small>Search and narrow the giving record</small></div></div>
                <label className={styles.search}><FiSearch aria-hidden="true" /><span className={styles.srOnly}>Search gifts</span><input onChange={(event) => setSearch(event.target.value)} placeholder="Name, campaign, note, or gift ID" value={search} /></label>
                <label className={styles.select}><span>Campaign</span><select onChange={(event) => setCampaignFilter(event.target.value)} value={campaignFilter}><option value="all">All campaigns</option>{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</select></label>
                <label className={styles.select}><span>Thanks</span><select onChange={(event) => setThanksFilter(event.target.value)} value={thanksFilter}><option value="all">All gifts</option><option value="pending">Needs thanks</option><option value="ready">Prepared</option></select></label>
                <label className={styles.select}><span>Sort</span><select onChange={(event) => setSort(event.target.value)} value={sort}><option value="recent">Newest first</option><option value="oldest">Oldest first</option><option value="largest">Largest amount</option></select></label>
            </section>

            <section className={styles.ledgerPanel} id="gift-list">
                <div className={styles.ledgerHeading}><div><span className={styles.sectionLabel}>THE GIVING BOOK</span><h2>Gift records</h2></div><span>{visibleGifts.length} of {gifts.length} records</span></div>
                {visibleGifts.length ? <div className={styles.giftList}>
                    {visibleGifts.map((gift) => {
                        const donor = donors.find((item) => item.id === gift.donorId);
                        const campaign = campaigns.find((item) => item.id === gift.campaignId);
                        return <article className={styles.giftRow} key={gift.id}>
                            <span className={styles.avatar + (donor ? "" : " " + styles.anonymous)}>{donor ? getInitials(donor) : <FiUsers aria-hidden="true" />}</span>
                            <div className={styles.giftIdentity}>
                                <div className={styles.personLine}>{donor ? <Link to={"/donors/" + donor.id}>{getDonorName(donor)}</Link> : <strong>Anonymous gift</strong>}<StatusPill status={gift.acknowledged ? "Thanks prepared" : "Needs thanks"} /></div>
                                <div className={styles.giftMeta}><span>{gift.id}</span><i /><span>{campaign?.name || "No campaign assigned"}</span><i /><span>{gift.method}{gift.method === "Monthly" ? " monthly" : ""}</span></div>
                                {gift.note && <p className={styles.giftNote}>{gift.note}</p>}
                            </div>
                            <div className={styles.giftDate}><span>{formatDate(gift.date, { month: "short", day: "numeric", year: "numeric" })}</span><strong>{formatCurrency(gift.amount)}</strong></div>
                            <div className={styles.giftActions}>
                                <button aria-label={gift.acknowledged ? "Move gift to thanks follow-up" : "Mark thanks as prepared"} className={gift.acknowledged ? styles.preparedButton : styles.thanksButton} onClick={() => onToggleAcknowledgment(gift.id)} title={gift.acknowledged ? "Move to follow-up" : "Mark thanks prepared"} type="button"><FiCheck aria-hidden="true" /><span>{gift.acknowledged ? "Prepared" : "Mark thanks"}</span></button>
                                <button aria-label={"Edit gift " + gift.id} className={styles.iconButton} onClick={() => setDialog({ mode: "edit", gift })} title="Edit gift" type="button"><FiEdit2 aria-hidden="true" /></button>
                                <button aria-label={"Remove gift " + gift.id} className={styles.iconButton + " " + styles.removeButton} onClick={() => setDialog({ mode: "delete", gift })} title="Remove gift" type="button"><FiTrash2 aria-hidden="true" /></button>
                            </div>
                        </article>;
                    })}
                </div> : <div className={styles.emptyState}><span><FiSearch aria-hidden="true" /></span><h3>No gift records match.</h3><p>Try a different search or clear filters to view all recorded gifts.</p><Button onClick={clearFilters}>Clear filters</Button></div>}
            </section>
            <p className={styles.disclaimer}>Kindred keeps this giving record in the current page session. Gift entries do not process payments, and prepared thanks do not send messages.</p>

            <Modal description={dialog?.mode === "edit" ? "Update the gift details linked to this record." : "Record a contribution. You can leave the donor and campaign unassigned."} onClose={closeDialog} open={dialog?.mode === "create" || dialog?.mode === "edit"} size="wide" title={dialog?.mode === "edit" ? "Edit gift " + dialog.gift.id : "Record a gift"}>
                <GiftForm campaigns={campaigns} donors={donors} initialValues={dialog?.gift} onSubmit={saveGift} submitLabel={dialog?.mode === "edit" ? "Save gift" : "Add gift record"} />
            </Modal>
            <Modal actions={<><Button onClick={closeDialog}>Keep record</Button><Button onClick={removeGift} variant="danger">Remove gift</Button></>} description="This gift will be removed from session totals, campaign progress, and the donor's giving history." onClose={closeDialog} open={dialog?.mode === "delete"} title="Remove this gift record?">
                <div className={styles.confirm}><FiTrash2 aria-hidden="true" /><p><strong>{dialog?.gift?.id}</strong> for {formatCurrency(dialog?.gift?.amount)} will be removed from this session.</p></div>
            </Modal>
        </main>
    );
};

export default Gifts;
