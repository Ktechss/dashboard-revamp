import {
  Building2,
  Search,
  BarChart3,
  FileText,
  CheckSquare,
  Settings,
  Plus,
  Eye,
  Layout as LayoutIcon,
  Users,
  DollarSign,
  Fingerprint,
  GitBranch,
  Activity,
  RefreshCw,
  FileCheck,
  Shield,
  Ticket,
  Layers,
  MapPin,
  CreditCard,
  ArrowLeft
} from 'lucide-react';

// =============================================================================
// SIDEBAR MODE TYPES
// =============================================================================
export const SIDEBAR_MODES = {
  DASHBOARD: 'dashboard',
  CLIENT: 'client',
  ONBOARDING: 'onboarding'
};

// =============================================================================
// ONBOARDING TYPES
// =============================================================================
export const ONBOARDING_TYPES = {
  GOVERNMENT: 'government',
  PRIVATE: 'private'
};

// =============================================================================
// PLATFORM/DASHBOARD NAVIGATION
// =============================================================================
export const platformNavigation = [
  { id: 'gov-search', icon: Search, label: 'Government Search', page: 'GovernmentSearch' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', page: 'Analytics' },
  { id: 'audit-logs', icon: FileText, label: 'Dashboard Audit Logs', page: 'AuditLogs' },
  { id: 'adjudicate', icon: CheckSquare, label: 'Adjudicate Tasks', page: 'AdjudicateTasks' },
  { id: 'settings', icon: Settings, label: 'Settings', page: 'Settings' }
];

export const quickActions = [
  { id: 'view-all', icon: Eye, label: 'View All Clients', page: 'AllClients', type: 'link' },
  { id: 'quick-search', icon: Search, label: 'Quick Search', action: 'quickSearch', type: 'button' },
  { id: 'onboard', icon: Plus, label: 'Onboard New Client', action: 'openOnboardSheet', type: 'primary' }
];

// =============================================================================
// CLIENT NAVIGATION
// =============================================================================
export const clientNavigation = [
  { id: 'journeys', icon: LayoutIcon, label: 'All Journeys', page: 'Journeys' },
  { id: 'remote-verify', icon: Fingerprint, label: 'Remote Verification', page: 'RemoteVerification' },
  { id: 'one-to-many', icon: GitBranch, label: 'One to Many', page: 'OneToMany' },
  { id: 'users', icon: Users, label: 'User Management', page: 'Users' },
  { id: 'balance', icon: DollarSign, label: 'Balance & Metering', page: 'Balance' },
  { id: 'api-info', icon: FileText, label: 'API Info', page: 'ApiInfo' },
  { id: 'pricing', icon: DollarSign, label: 'API Pricing & Credits', page: 'Pricing' },
  { id: 'migration', icon: RefreshCw, label: 'Population Migration', page: 'Migration' },
  { id: 'monitoring', icon: Activity, label: 'Proactive Monitoring', page: 'Monitoring' },
  {
    id: 'validation',
    icon: FileCheck,
    label: 'Validation Transactions',
    page: 'Validation',
    condition: (org) => org?.validation_config?.eid_validation?.enabled ||
                        org?.validation_config?.passport_validation?.enabled
  },
  {
    id: 'batch-validation',
    icon: Layers,
    label: 'Batch Validation',
    page: 'BatchValidation',
    condition: (org) => org?.validation_config?.batch_processing?.enabled
  },
  { id: 'sandbox', icon: Shield, label: 'Sandbox Residents', page: 'Sandbox' },
  { id: 'settings', icon: Settings, label: 'Settings', page: 'Settings' },
  { id: 'tickets', icon: Ticket, label: 'Tickets', page: 'Tickets' }
];

// =============================================================================
// ONBOARDING STEPS CONFIGURATION
// =============================================================================
export const governmentOnboardingSteps = [
  { number: 1, title: 'Organization Information', icon: Building2, description: 'Basic org details' },
  { number: 2, title: 'Address & Contact', icon: MapPin, description: 'Location & contact info' }
];

export const privateOnboardingSteps = [
  { number: 1, title: 'Organization Details', icon: Building2, description: 'Company & admin info' },
  { number: 2, title: 'Module Configuration', icon: Settings, description: 'Journey & verification setup' },
  { number: 3, title: 'Pricing & Credits', icon: CreditCard, description: 'Pricing configuration' },
  { number: 4, title: 'Additional Features', icon: Settings, description: 'Extra configurations' }
];

// =============================================================================
// MOCK ORGANIZATIONS DATA
// =============================================================================
export const mockOrganizations = [
  {
    id: 'gov-1',
    name: 'Dubai Police',
    type: 'government',
    email: 'contact@dubaipolice.gov.ae',
    phone: '+971501234567',
    validation_config: {
      eid_validation: { enabled: true },
      passport_validation: { enabled: true },
      batch_processing: { enabled: true }
    }
  },
  {
    id: 'pvt-1',
    name: 'Emirates NBD',
    type: 'private',
    email: 'kyc@emiratesnbd.com',
    phone: '+971509876543',
    validation_config: {
      eid_validation: { enabled: true },
      passport_validation: { enabled: false },
      batch_processing: { enabled: true }
    }
  }
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
export const getClientNavigation = (organization) => {
  return clientNavigation.filter(item => {
    if (!item.condition) return true;
    return item.condition(organization);
  });
};

export const getOnboardingSteps = (type) => {
  return type === ONBOARDING_TYPES.GOVERNMENT
    ? governmentOnboardingSteps
    : privateOnboardingSteps;
};

// =============================================================================
// SECTION TYPES - Types of sections that can be rendered in sidebar
// =============================================================================
export const SECTION_TYPES = {
  NAVIGATION: 'navigation',        // Renders navigation links
  ACTIONS: 'actions',              // Renders action buttons
  ORG_LIST: 'org-list',           // Renders collapsible organization list
  CLIENT_INFO: 'client-info',     // Renders selected client info header
  STEPPER: 'stepper',             // Renders onboarding stepper
  BACK_BUTTON: 'back-button',     // Renders back navigation button
  PROGRESS: 'progress'            // Renders progress bar
};

// =============================================================================
// SIDEBAR SECTIONS CONFIGURATION - Single source of truth for all modes
// =============================================================================
export const sidebarConfig = {
  // Dashboard mode configuration
  [SIDEBAR_MODES.DASHBOARD]: {
    width: 'w-64',
    showLogo: true,
    showUserProfile: true,
    sections: [
      {
        id: 'platform',
        type: SECTION_TYPES.NAVIGATION,
        title: 'Platform',
        items: platformNavigation
      },
      {
        id: 'quick-actions',
        type: SECTION_TYPES.ACTIONS,
        title: 'Quick Actions',
        items: quickActions
      },
      {
        id: 'gov-orgs',
        type: SECTION_TYPES.ORG_LIST,
        title: 'Government Orgs',
        orgType: 'government',
        collapsible: true,
        defaultExpanded: true
      },
      {
        id: 'private-orgs',
        type: SECTION_TYPES.ORG_LIST,
        title: 'Private Orgs',
        orgType: 'private',
        collapsible: true,
        defaultExpanded: true
      }
    ]
  },

  // Client mode configuration
  [SIDEBAR_MODES.CLIENT]: {
    width: 'w-64',
    showLogo: true,
    showUserProfile: false,
    sections: [
      {
        id: 'back-to-platform',
        type: SECTION_TYPES.BACK_BUTTON,
        label: 'Back to Platform',
        icon: ArrowLeft
      },
      {
        id: 'client-info',
        type: SECTION_TYPES.CLIENT_INFO
      },
      {
        id: 'client-nav',
        type: SECTION_TYPES.NAVIGATION,
        title: null, // No title for client nav
        getItems: (organization) => getClientNavigation(organization)
      }
    ]
  },

  // Onboarding mode configuration
  [SIDEBAR_MODES.ONBOARDING]: {
    width: 'w-72',
    showLogo: false,
    showUserProfile: false,
    sections: [
      {
        id: 'back-to-dashboard',
        type: SECTION_TYPES.BACK_BUTTON,
        label: 'Back',
        icon: ArrowLeft
      },
      {
        id: 'onboarding-stepper',
        type: SECTION_TYPES.STEPPER,
        getSteps: (type) => getOnboardingSteps(type)
      },
      {
        id: 'progress',
        type: SECTION_TYPES.PROGRESS,
        position: 'footer' // Renders in footer area
      }
    ]
  }
};

// =============================================================================
// GET SIDEBAR CONFIG - Helper to get config for a specific mode
// =============================================================================
export const getSidebarConfig = (mode) => {
  return sidebarConfig[mode] || sidebarConfig[SIDEBAR_MODES.DASHBOARD];
};
