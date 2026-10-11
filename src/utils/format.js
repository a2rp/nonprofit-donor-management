const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

export const formatCurrency = (amount) => currency.format(Number(amount) || 0);

export const formatCompactCurrency = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
}).format(Number(amount) || 0);

export const formatDate = (date, options = { month: "short", day: "numeric", year: "numeric" }) => {
    if (!date) return "Not set";
    return new Intl.DateTimeFormat("en-US", options).format(new Date(`${date}T12:00:00`));
};

export const getDonorName = (donor) => donor ? `${donor.firstName} ${donor.lastName}`.trim() : "Former donor";

export const getInitials = (donor) => donor
    ? `${donor.firstName?.[0] || ""}${donor.lastName?.[0] || ""}`.toUpperCase()
    : "?";
