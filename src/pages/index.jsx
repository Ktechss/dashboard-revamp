/**
 * Pages Router Configuration
 *
 * Structure:
 * - dashboard/  : Platform-level admin pages (home, analytics, client management)
 * - client/     : Organization-specific pages (journeys, validation, users, etc.)
 */

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './Layout';

// =============================================================================
// DASHBOARD PAGES - Platform/Admin Level
// =============================================================================
import Home from './dashboard/home/Home';
import Analytics from './dashboard/analytics/Analytics';
import GovernmentSearch from './dashboard/government-search/GovernmentSearch';
import AuditLogs from './dashboard/audit-logs/AuditLogs';
import AdjudicateTasks from './dashboard/adjudicate-tasks/AdjudicateTasks';
import DashboardSettings from './dashboard/settings/Settings';

// Client Management
import AllClients from './dashboard/clients/AllClients';
import OnboardClient from './dashboard/clients/onboarding/OnboardClient';

// =============================================================================
// CLIENT PAGES - Organization Specific (when a client is selected)
// =============================================================================
import Journeys from './client/journeys/Journeys';
import RemoteVerification from './client/remote-verification/RemoteVerification';
import OneToMany from './client/one-to-many/OneToMany';
import Users from './client/users/Users';
import Balance from './client/balance/Balance';
import ApiInfo from './client/api-info/ApiInfo';
import Pricing from './client/pricing/Pricing';
import Migration from './client/migration/Migration';
import Monitoring from './client/monitoring/Monitoring';
import Validation from './client/validation/Validation';
import ValidationDetail from './client/validation/ValidationDetail';
import BatchValidation from './client/batch-validation/BatchValidation';
import BatchValidationDetail from './client/batch-validation/BatchValidationDetail';
import Sandbox from './client/sandbox/Sandbox';
import ClientSettings from './client/settings/Settings';
import Tickets from './client/tickets/Tickets';

// =============================================================================
// PAGE REGISTRY
// =============================================================================
const PAGES = {
  // Dashboard pages
  Home,
  Analytics,
  GovernmentSearch,
  AuditLogs,
  AdjudicateTasks,
  AllClients,
  OnboardClient,

  // Client pages
  Journeys,
  RemoteVerification,
  OneToMany,
  Users,
  Balance,
  ApiInfo,
  Pricing,
  Migration,
  Monitoring,
  Validation,
  ValidationDetail,
  BatchValidation,
  BatchValidationDetail,
  Sandbox,
  Tickets,

  // Settings (uses dashboard settings by default)
  Settings: DashboardSettings,
};

function _getCurrentPage(url) {
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  let urlLastPart = url.split('/').pop();
  if (urlLastPart.includes('?')) {
    urlLastPart = urlLastPart.split('?')[0];
  }
  const pageName = Object.keys(PAGES).find(
    page => page.toLowerCase() === urlLastPart.toLowerCase()
  );
  return pageName || Object.keys(PAGES)[0];
}

function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <Layout currentPageName={currentPage}>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Home />} />

        {/* Dashboard routes */}
        <Route path="/Home" element={<Home />} />
        <Route path="/Analytics" element={<Analytics />} />
        <Route path="/GovernmentSearch" element={<GovernmentSearch />} />
        <Route path="/AuditLogs" element={<AuditLogs />} />
        <Route path="/AdjudicateTasks" element={<AdjudicateTasks />} />
        <Route path="/AllClients" element={<AllClients />} />
        <Route path="/OnboardClient" element={<OnboardClient />} />
        <Route path="/Settings" element={<DashboardSettings />} />

        {/* Client routes */}
        <Route path="/Journeys" element={<Journeys />} />
        <Route path="/RemoteVerification" element={<RemoteVerification />} />
        <Route path="/OneToMany" element={<OneToMany />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/Balance" element={<Balance />} />
        <Route path="/ApiInfo" element={<ApiInfo />} />
        <Route path="/Pricing" element={<Pricing />} />
        <Route path="/Migration" element={<Migration />} />
        <Route path="/Monitoring" element={<Monitoring />} />
        <Route path="/Validation" element={<Validation />} />
        <Route path="/ValidationDetail" element={<ValidationDetail />} />
        <Route path="/BatchValidation" element={<BatchValidation />} />
        <Route path="/BatchValidationDetail" element={<BatchValidationDetail />} />
        <Route path="/Sandbox" element={<Sandbox />} />
        <Route path="/Tickets" element={<Tickets />} />
      </Routes>
    </Layout>
  );
}

export default function Pages() {
  return (
    <Router>
      <PagesContent />
    </Router>
  );
}
