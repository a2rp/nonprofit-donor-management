import { useEffect, useRef, useState } from "react";
import AppRoutes from "./AppRoutes.jsx";
import styles from "./App.module.css";
import Footer from "./components/footer/index.jsx";
import Header from "./components/header/index.jsx";
import ScrollToTop from "./components/scrollToTop/index.jsx";
import Toast from "./components/toast/index.jsx";
import { initialCampaigns, initialDonors, initialGifts } from "./data/seed.js";

const createId = (prefix, records) => {
    const largest = records.reduce((current, record) => Math.max(current, Number(record.id.split("-")[1]) || 0), 0);
    return `${prefix}-${largest + 1}`;
};

const App = () => {
    const [donors, setDonors] = useState(initialDonors);
    const [campaigns, setCampaigns] = useState(initialCampaigns);
    const [gifts, setGifts] = useState(initialGifts);
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);

    const notify = (title, message = "", type = "success") => {
        window.clearTimeout(toastTimer.current);
        setToast({ title, message, type });
        toastTimer.current = window.setTimeout(() => setToast(null), 5200);
    };

    const closeToast = () => {
        window.clearTimeout(toastTimer.current);
        setToast(null);
    };

    useEffect(() => () => window.clearTimeout(toastTimer.current), []);

    const createDonor = (draft) => {
        const donor = { ...draft, id: createId("D", donors), joinedOn: draft.joinedOn || new Date().toISOString().slice(0, 10), touchpoints: [] };
        setDonors((current) => [donor, ...current]);
        notify("Donor added", `${donor.firstName} ${donor.lastName} is in your relationship book.`);
    };

    const updateDonor = (donorId, draft) => {
        setDonors((current) => current.map((donor) => donor.id === donorId ? { ...donor, ...draft } : donor));
        notify("Donor details saved", "The profile has been updated for this session.");
    };

    const deleteDonor = (donorId) => {
        const removed = donors.find((donor) => donor.id === donorId);
        setDonors((current) => current.filter((donor) => donor.id !== donorId));
        setGifts((current) => current.map((gift) => gift.donorId === donorId ? { ...gift, donorId: null } : gift));
        notify("Donor removed", `${removed?.firstName || "The donor"}'s gift records remain without personal contact details.`);
    };

    const addTouchpoint = (donorId, touchpoint) => {
        setDonors((current) => current.map((donor) => donor.id === donorId
            ? { ...donor, touchpoints: [{ ...touchpoint, id: `T-${Date.now()}` }, ...donor.touchpoints] }
            : donor));
        notify("Stewardship note saved", "The touchpoint was added to the donor timeline.");
    };

    const createCampaign = (draft) => {
        const campaign = { ...draft, id: createId("C", campaigns), status: "Active" };
        setCampaigns((current) => [campaign, ...current]);
        notify("Campaign added", `${campaign.name} is ready to track.`);
    };

    const updateCampaign = (campaignId, draft) => {
        setCampaigns((current) => current.map((campaign) => campaign.id === campaignId ? { ...campaign, ...draft } : campaign));
        notify("Campaign updated", "The campaign details have been saved for this session.");
    };

    const archiveCampaign = (campaignId) => {
        setCampaigns((current) => current.map((campaign) => campaign.id === campaignId ? { ...campaign, status: "Archived" } : campaign));
        notify("Campaign archived", "It is hidden from new gift entries and remains in your records.");
    };

    const restoreCampaign = (campaignId) => {
        setCampaigns((current) => current.map((campaign) => campaign.id === campaignId ? { ...campaign, status: "Active" } : campaign));
        notify("Campaign restored", "It is available for new gift entries again.");
    };

    const deleteCampaign = (campaignId) => {
        const removed = campaigns.find((campaign) => campaign.id === campaignId);
        setCampaigns((current) => current.filter((campaign) => campaign.id !== campaignId));
        setGifts((current) => current.map((gift) => gift.campaignId === campaignId ? { ...gift, campaignId: null } : gift));
        notify("Campaign removed", `${removed?.name || "The campaign"} was removed. Gift amounts remain in the giving record.`);
    };

    const createGift = (draft) => {
        const gift = {
            ...draft,
            id: createId("G", gifts),
            donorId: draft.donorId || null,
            campaignId: draft.campaignId || null,
            amount: Number(draft.amount),
            acknowledged: false,
            recurring: draft.method === "Monthly",
            status: "Received",
        };
        setGifts((current) => [gift, ...current]);
        notify("Gift recorded", "Giving totals and the donor profile are up to date.");
    };

    const updateGift = (giftId, draft) => {
        setGifts((current) => current.map((gift) => gift.id === giftId
            ? { ...gift, ...draft, donorId: draft.donorId || null, campaignId: draft.campaignId || null, amount: Number(draft.amount), recurring: draft.method === "Monthly" }
            : gift));
        notify("Gift details saved", "The giving record has been updated for this session.");
    };

    const deleteGift = (giftId) => {
        setGifts((current) => current.filter((gift) => gift.id !== giftId));
        notify("Gift record removed", "The giving totals now reflect the remaining records.");
    };

    const toggleAcknowledgment = (giftId) => {
        const gift = gifts.find((item) => item.id === giftId);
        const acknowledged = !gift?.acknowledged;
        setGifts((current) => current.map((item) => item.id === giftId ? { ...item, acknowledged } : item));
        notify(acknowledged ? "Thanks marked as prepared" : "Thanks moved to the follow-up list", "No message was sent from this demo.", "info");
    };

    const appData = {
        donors,
        campaigns,
        gifts,
        onToast: notify,
        onCreateDonor: createDonor,
        onUpdateDonor: updateDonor,
        onDeleteDonor: deleteDonor,
        onAddTouchpoint: addTouchpoint,
        onCreateCampaign: createCampaign,
        onUpdateCampaign: updateCampaign,
        onArchiveCampaign: archiveCampaign,
        onRestoreCampaign: restoreCampaign,
        onDeleteCampaign: deleteCampaign,
        onCreateGift: createGift,
        onUpdateGift: updateGift,
        onDeleteGift: deleteGift,
        onToggleAcknowledgment: toggleAcknowledgment,
    };

    return (
        <div className={styles.app}>
            <ScrollToTop />
            <a className={styles.skipLink} href="#main-content">Skip to content</a>
            <Header />
            <main className={styles.main} id="main-content">
                <AppRoutes appData={appData} />
            </main>
            <Footer />
            <Toast onClose={closeToast} toast={toast} />
        </div>
    );
};

export default App;
