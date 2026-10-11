import { useMemo, useState } from "react";
import { FiArchive, FiArrowUpRight, FiCalendar, FiEdit2, FiHeart, FiPlus, FiSearch, FiTarget, FiTrash2, FiUsers } from "react-icons/fi";
import Button from "../../components/button/index.jsx";
import CampaignForm from "../../components/campaignForm/index.jsx";
import Modal from "../../components/modal/index.jsx";
import StatusPill from "../../components/statusPill/index.jsx";
import { formatCompactCurrency, formatCurrency, formatDate } from "../../utils/format.js";
import styles from "./styles.module.css";

const Campaigns = ({ campaigns, gifts, onCreateCampaign, onUpdateCampaign, onArchiveCampaign, onRestoreCampaign, onDeleteCampaign }) => {
    const [view, setView] = useState("Active");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("progress");
    const [dialog, setDialog] = useState(null);
    const campaignRows = useMemo(() => campaigns.filter((campaign) => {
        const query = search.trim().toLowerCase();
        return campaign.status === view && (!query || (campaign.name + " " + campaign.program + " " + campaign.description).toLowerCase().includes(query));
    }).map((campaign) => {
        const campaignGifts = gifts.filter((gift) => gift.campaignId === campaign.id);
        const raised = campaignGifts.reduce((sum, gift) => sum + gift.amount, 0);
        return { ...campaign, campaignGifts, raised, supporterCount: new Set(campaignGifts.map((gift) => gift.donorId).filter(Boolean)).size, progress: campaign.goal ? Math.min(raised / campaign.goal * 100, 100) : 0 };
    }).sort((first, second) => {
        if (sort === "goal") return second.goal - first.goal;
        if (sort === "ending") return first.endDate.localeCompare(second.endDate);
        return second.progress - first.progress;
    }), [campaigns, gifts, search, sort, view]);
    const totalRaised = campaignRows.reduce((sum, campaign) => sum + campaign.raised, 0);
    const totalGoal = campaignRows.reduce((sum, campaign) => sum + campaign.goal, 0);
    const closeDialog = () => setDialog(null);

    const saveCampaign = (draft) => {
        if (dialog.mode === "edit") onUpdateCampaign(dialog.campaign.id, draft);
        else onCreateCampaign(draft);
        closeDialog();
    };

    const confirmAction = () => {
        if (dialog.mode === "archive") onArchiveCampaign(dialog.campaign.id);
        if (dialog.mode === "restore") onRestoreCampaign(dialog.campaign.id);
        if (dialog.mode === "delete") onDeleteCampaign(dialog.campaign.id);
        closeDialog();
    };

    const confirmations = {
        archive: { title: "Archive this campaign?", description: "It will leave the active board and remain available in archived campaigns.", action: "Archive campaign", icon: <FiArchive aria-hidden="true" /> },
        restore: { title: "Restore this campaign?", description: "It will return to the active board and become available for new gift records.", action: "Restore campaign", icon: <FiArrowUpRight aria-hidden="true" /> },
        delete: { title: "Remove this campaign?", description: "Its gift records will remain, but they will no longer be assigned to this campaign.", action: "Remove campaign", icon: <FiTrash2 aria-hidden="true" /> },
    };

    return (
        <main className={styles.page}>
            <section className={styles.heading}>
                <div><span className={styles.context}>PURPOSE IN MOTION / CAMPAIGNS</span><h1>Good work grows together.</h1><p>Follow each community effort from its first gift through the goal it is working toward.</p></div>
                <Button icon={<FiPlus />} onClick={() => setDialog({ mode: "create" })} variant="primary">Create campaign</Button>
            </section>

            <section className={styles.summaryStrip} aria-label="Campaign summary">
                <div className={styles.summaryMark}><FiTarget aria-hidden="true" /></div>
                <div className={styles.summaryMain}><span>{view.toUpperCase()} CAMPAIGNS</span><strong>{formatCompactCurrency(totalRaised)} <small>of {formatCompactCurrency(totalGoal)} raised</small></strong><i><b style={{ width: totalGoal ? Math.min(totalRaised / totalGoal * 100, 100) + "%" : "0%" }} /></i></div>
                <div className={styles.summaryStat}><FiHeart aria-hidden="true" /><strong>{campaignRows.reduce((sum, campaign) => sum + campaign.campaignGifts.length, 0)}</strong><span>gifts</span></div>
                <div className={styles.summaryStat}><FiUsers aria-hidden="true" /><strong>{new Set(campaignRows.flatMap((campaign) => campaign.campaignGifts.map((gift) => gift.donorId).filter(Boolean))).size}</strong><span>supporters</span></div>
            </section>

            <section className={styles.toolbar} aria-label="Campaign board filters">
                <div className={styles.tabs} role="group" aria-label="Campaign status">
                    {[
                        { name: "Active", count: campaigns.filter((campaign) => campaign.status === "Active").length },
                        { name: "Archived", count: campaigns.filter((campaign) => campaign.status === "Archived").length },
                    ].map((item) => <button aria-pressed={view === item.name} className={view === item.name ? styles.selectedTab : ""} key={item.name} onClick={() => setView(item.name)} type="button">{item.name}<span>{item.count}</span></button>)}
                </div>
                <label className={styles.search}><FiSearch aria-hidden="true" /><span className={styles.srOnly}>Search campaigns</span><input onChange={(event) => setSearch(event.target.value)} placeholder="Find a campaign or program" value={search} /></label>
                <label className={styles.sort}><span>Sort by</span><select onChange={(event) => setSort(event.target.value)} value={sort}><option value="progress">Goal progress</option><option value="ending">End date</option><option value="goal">Largest goal</option></select></label>
            </section>
            <div className={styles.results}><strong>{campaignRows.length} {view.toLowerCase()} {campaignRows.length === 1 ? "campaign" : "campaigns"}</strong><span>Campaign progress reflects gifts recorded in this session.</span></div>

            {campaignRows.length ? <section className={styles.campaignGrid} aria-label={view + " campaigns"}>
                {campaignRows.map((campaign, index) => <article className={styles.campaignCard} key={campaign.id}>
                    <div className={styles.cardAccent}>
                        <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
                        <StatusPill status={campaign.status} />
                        <span className={styles.endDate}><FiCalendar aria-hidden="true" /> Ends {formatDate(campaign.endDate, { month: "short", day: "numeric" })}</span>
                    </div>
                    <div className={styles.cardBody}>
                        <span className={styles.program}>{campaign.program}</span>
                        <h2>{campaign.name}</h2>
                        <p className={styles.description}>{campaign.description || "A community effort supported by thoughtful, consistent giving."}</p>
                        <div className={styles.progressHeading}><strong>{formatCurrency(campaign.raised)}</strong><span>{Math.round(campaign.progress)}% of {formatCurrency(campaign.goal)}</span></div>
                        <div className={styles.progressTrack}><i style={{ width: campaign.progress + "%" }} /></div>
                        <div className={styles.givingFacts}><span><FiHeart aria-hidden="true" /> {campaign.campaignGifts.length} {campaign.campaignGifts.length === 1 ? "gift" : "gifts"}</span><span><FiUsers aria-hidden="true" /> {campaign.supporterCount} {campaign.supporterCount === 1 ? "supporter" : "supporters"}</span></div>
                    </div>
                    <footer className={styles.cardActions}>
                        <button onClick={() => setDialog({ mode: "edit", campaign })} type="button"><FiEdit2 aria-hidden="true" /> Edit details</button>
                        {campaign.status === "Active"
                            ? <button onClick={() => setDialog({ mode: "archive", campaign })} type="button"><FiArchive aria-hidden="true" /> Archive</button>
                            : <button onClick={() => setDialog({ mode: "restore", campaign })} type="button"><FiArrowUpRight aria-hidden="true" /> Restore</button>}
                        <button aria-label={"Remove " + campaign.name} className={styles.removeButton} onClick={() => setDialog({ mode: "delete", campaign })} title="Remove campaign" type="button"><FiTrash2 aria-hidden="true" /></button>
                    </footer>
                </article>)}
            </section> : <section className={styles.emptyState}>
                <span><FiTarget aria-hidden="true" /></span><h2>{search ? "No campaigns match that search." : "No " + view.toLowerCase() + " campaigns yet."}</h2><p>{search ? "Try another program name or clear your search." : "Create a campaign when your team is ready to track a community goal."}</p>
                {search ? <Button onClick={() => setSearch("")}>Clear search</Button> : view === "Active" && <Button icon={<FiPlus />} onClick={() => setDialog({ mode: "create" })} variant="primary">Create campaign</Button>}
            </section>}

            <Modal description={dialog?.mode === "edit" ? "Update the goal, program details, or end date for this campaign." : "Name the community effort, choose its program area, and set a measurable goal."} onClose={closeDialog} open={dialog?.mode === "create" || dialog?.mode === "edit"} size="wide" title={dialog?.mode === "edit" ? "Edit " + dialog.campaign.name : "Create a campaign"}>
                <CampaignForm initialValues={dialog?.campaign} onSubmit={saveCampaign} submitLabel={dialog?.mode === "edit" ? "Save campaign" : "Create campaign"} />
            </Modal>
            <Modal actions={<><Button onClick={closeDialog}>Keep campaign</Button><Button onClick={confirmAction} variant={dialog?.mode === "delete" ? "danger" : "primary"}>{confirmations[dialog?.mode]?.action}</Button></>} description={confirmations[dialog?.mode]?.description} onClose={closeDialog} open={Boolean(confirmations[dialog?.mode])} title={confirmations[dialog?.mode]?.title}>
                <div className={styles.confirm}><span>{confirmations[dialog?.mode]?.icon}</span><p><strong>{dialog?.campaign?.name}</strong> will be updated in the current session.</p></div>
            </Modal>
        </main>
    );
};

export default Campaigns;
