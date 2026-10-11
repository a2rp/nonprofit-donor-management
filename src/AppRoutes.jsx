import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading/index.jsx";

const Overview = lazy(() => import("./pages/overview/index.jsx"));
const Donors = lazy(() => import("./pages/donors/index.jsx"));
const DonorProfile = lazy(() => import("./pages/donorProfile/index.jsx"));
const Campaigns = lazy(() => import("./pages/campaigns/index.jsx"));
const Gifts = lazy(() => import("./pages/gifts/index.jsx"));
const NotFound = lazy(() => import("./pages/notFound/index.jsx"));

const AppRoutes = ({ appData }) => {
    const location = useLocation();

    return (
        <Suspense fallback={<Loading />} key={location.pathname}>
            <Routes location={location}>
                <Route element={<Overview {...appData} />} path="/" />
                <Route element={<Donors {...appData} />} path="/donors" />
                <Route element={<DonorProfile {...appData} />} path="/donors/:donorId" />
                <Route element={<Campaigns {...appData} />} path="/campaigns" />
                <Route element={<Gifts {...appData} />} path="/gifts" />
                <Route element={<NotFound />} path="*" />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
