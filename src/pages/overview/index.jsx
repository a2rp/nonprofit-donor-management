import { FiArrowRight, FiArrowUpRight, FiHeart, FiPlus, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import StatusPill from "../../components/statusPill/index.jsx";
import { formatCompactCurrency, formatCurrency, formatDate, getDonorName } from "../../utils/format.js";
import styles from "./styles.module.css";

const Overview = ({ donors, campaigns, gifts, onToggleAcknowledgment }) => {
    const totalGiven = gifts.reduce((sum, gift) => sum + gift.amount, 0);
    const thankYouQueue = gifts.filter((gift) => !gift.acknowledged).slice(0, 3);
    const activeCampaigns = campaigns.filter((campaign) => campaign.status === "Active");
    const focusCampaign = activeCampaigns.find((campaign) => campaign.id === "C-301") || activeCampaigns[0];
    const focusRaised = focusCampaign ? gifts.filter((gift) => gift.campaignId === focusCampaign.id).reduce((sum, gift) => sum + gift.amount, 0) : 0;
    const recentGifts = [...gifts].sort((first, second) => second.date.localeCompare(first.date)).slice(0, 5);
    const topCampaigns = campaigns.map((campaign) => ({
        ...campaign,
        raised: gifts.filter((gift) => gift.campaignId === campaign.id).reduce((sum, gift) => sum + gift.amount, 0),
    })).sort((first, second) => second.raised / second.goal - first.raised / first.goal).slice(0, 3);

    return (
        <main className={styles.page}>
            <section className={styles.heading}>
                <div>
                    <span className={styles.context}>COMMUNITY RELATIONS <i /> OCTOBER 2026</span>
                    <h1>Care travels a little further.</h1>
                    <p>Keep the people behind your impact close, and the next thank-you easy to find.</p>
                </div>
                <Link className={styles.recordGift} to="/gifts"><FiPlus aria-hidden="true" /> Record a gift</Link>
            </section>

            <section className={styles.heroBoard}>
                <article className={styles.featurePanel}>
                    <img alt="Volunteers packing food donations at a community food bank" src={`${import.meta.env.BASE_URL}assets/food-bank-volunteers.jpg`} />
                    <div className={styles.featureShade} />
                    <div className={styles.featureContent}>
                        <span className={styles.featureLabel}><FiHeart aria-hidden="true" /> COMMUNITY FOCUS</span>
                        <h2>{focusCampaign?.name || "Make room at the table."}</h2>
                        <p>{focusCampaign?.description || "A dependable welcome for neighbors across our community."}</p>
                        {focusCampaign && <div className={styles.featureProgress}>
                            <div><strong>{formatCompactCurrency(focusRaised)}</strong><span>of {formatCurrency(focusCampaign.goal)} raised</span></div>
                            <span className={styles.progressTrack}><i style={{ width: `${Math.min(focusRaised / focusCampaign.goal * 100, 100)}%` }} /></span>
                        </div>}
                        {focusCampaign && <Link className={styles.featureLink} to="/campaigns">Explore the campaign board <FiArrowUpRight aria-hidden="true" /></Link>}
                    </div>
                    <span className={styles.imageCredit}>Food bank volunteers, Joel Muniz / Unsplash</span>
                </article>

                <aside className={styles.thanksPanel}>
                    <div className={styles.thanksHeading}>
                        <span className={styles.thanksMark}><FiHeart aria-hidden="true" /></span>
                        <div><span className={styles.sectionLabel}>STEWARDSHIP RHYTHM</span><h2>Thanks to prepare</h2></div>
                        <span className={styles.pendingCount}>{gifts.filter((gift) => !gift.acknowledged).length}</span>
                    </div>
                    <p className={styles.thanksIntro}>A thoughtful follow-up keeps every gift personal.</p>
                    <div className={styles.thanksList}>
                        {thankYouQueue.map((gift) => {
                            const donor = donors.find((item) => item.id === gift.donorId);
                            return <article className={styles.thanksItem} key={gift.id}>
                                <span className={styles.avatar}>{getDonorName(donor).split(" ").map((name) => name[0]).slice(0, 2).join("")}</span>
                                <div className={styles.thanksCopy}><strong>{getDonorName(donor)}</strong><span>{formatCurrency(gift.amount)} · {formatDate(gift.date, { month: "short", day: "numeric" })}</span></div>
                                <button aria-label={`Mark thanks prepared for ${getDonorName(donor)}`} className={styles.checkButton} onClick={() => onToggleAcknowledgment(gift.id)} title="Mark thanks prepared" type="button"><FiHeart aria-hidden="true" /></button>
                            </article>;
                        })}
                        {!thankYouQueue.length && <p className={styles.emptyThanks}>All gifts in view have a thank-you marked as prepared.</p>}
                    </div>
                    <Link className={styles.textLink} to="/gifts">Open the giving ledger <FiArrowRight aria-hidden="true" /></Link>
                </aside>
            </section>

            <section aria-label="Giving overview" className={styles.metrics}>
                <article><span className={`${styles.metricIcon} ${styles.lilac}`}><FiUsers aria-hidden="true" /></span><div><small>People in your circle</small><strong>{donors.length}</strong><span>Across active relationships</span></div><Link aria-label="Browse donors" to="/donors"><FiArrowUpRight aria-hidden="true" /></Link></article>
                <article><span className={`${styles.metricIcon} ${styles.gold}`}><FiHeart aria-hidden="true" /></span><div><small>Gifts recorded</small><strong>{formatCompactCurrency(totalGiven)}</strong><span>{gifts.length} gifts in this session</span></div><Link aria-label="Review gifts" to="/gifts"><FiArrowUpRight aria-hidden="true" /></Link></article>
                <article><span className={`${styles.metricIcon} ${styles.coral}`}><FiArrowRight aria-hidden="true" /></span><div><small>Campaigns in motion</small><strong>{activeCampaigns.length}</strong><span>Programs with an active goal</span></div><Link aria-label="Explore campaigns" to="/campaigns"><FiArrowUpRight aria-hidden="true" /></Link></article>
            </section>

            <section className={styles.lowerGrid}>
                <div className={styles.campaignPanel}>
                    <div className={styles.panelHeading}><div><span className={styles.sectionLabel}>GIVING WITH PURPOSE</span><h2>Campaigns in motion</h2></div><Link to="/campaigns">All campaigns <FiArrowUpRight aria-hidden="true" /></Link></div>
                    <div className={styles.campaignList}>
                        {topCampaigns.map((campaign, index) => <Link className={styles.campaignItem} key={campaign.id} to="/campaigns">
                            <span className={`${styles.campaignNumber} ${styles[`number${index}`]}`}>0{index + 1}</span>
                            <span className={styles.campaignCopy}><strong>{campaign.name}</strong><span>{campaign.program}</span><i><b style={{ width: `${Math.min(campaign.raised / campaign.goal * 100, 100)}%` }} /></i></span>
                            <span className={styles.campaignRaised}><strong>{formatCompactCurrency(campaign.raised)}</strong><small>of {formatCompactCurrency(campaign.goal)}</small></span>
                        </Link>)}
                        {!topCampaigns.length && <p className={styles.emptyState}>Add a campaign to start following program progress.</p>}
                    </div>
                </div>

                <div className={styles.giftPanel}>
                    <div className={styles.panelHeading}><div><span className={styles.sectionLabel}>RECENT GENEROSITY</span><h2>Gifts, just in</h2></div><Link to="/gifts">View ledger <FiArrowUpRight aria-hidden="true" /></Link></div>
                    <div className={styles.giftList}>
                        {recentGifts.map((gift) => {
                            const donor = donors.find((item) => item.id === gift.donorId);
                            const campaign = campaigns.find((item) => item.id === gift.campaignId);
                            return <Link className={styles.giftItem} key={gift.id} to="/gifts">
                                <span className={`${styles.giftHeart} ${gift.acknowledged ? styles.giftThanked : ""}`}><FiHeart aria-hidden="true" /></span>
                                <span className={styles.giftCopy}><strong>{getDonorName(donor)}</strong><span>{campaign?.name || "Unassigned campaign"} · {formatDate(gift.date, { month: "short", day: "numeric" })}</span></span>
                                <strong className={styles.giftAmount}>{formatCurrency(gift.amount)}</strong>
                            </Link>;
                        })}
                        {!recentGifts.length && <p className={styles.emptyState}>New gift records will show up here.</p>}
                    </div>
                </div>
            </section>
            <div className={styles.sessionNote}><span>DEMO WORKSPACE</span><p>Donor, campaign, and gift changes stay in this page session. No message or payment is sent from Kindred.</p></div>
        </main>
    );
};

export default Overview;
