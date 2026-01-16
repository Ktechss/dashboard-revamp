// Mock data for KYC Platform

export const mockOrganizations = [
  {
    id: 'gov-1',
    name: 'Dubai Police',
    type: 'government',
    email: 'contact@dubaipolice.gov.ae',
    phone: '+971501234567',
    address: 'Dubai Police HQ, Al Ittihad Road',
    city: 'Dubai',
    country: 'UAE',
    primary_contact_name: 'Ahmed Al Maktoum',
    primary_contact_email: 'ahmed@dubaipolice.gov.ae',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'pvt-1',
    name: 'Emirates NBD',
    type: 'private',
    email: 'kyc@emiratesnbd.com',
    phone: '+971509876543',
    address: 'Emirates NBD Tower, DIFC',
    city: 'Dubai',
    country: 'UAE',
    organization_category: 'Financial',
    primary_contact_name: 'Sara Hassan',
    primary_contact_email: 'sara@emiratesnbd.com',
    created_at: '2024-02-20T14:30:00Z'
  }
];

export const mockJourneys = [
  {
    id: '1',
    organization_id: 'gov-1',
    journey_config_id: 'ONBOARDING_ABC123',
    journey_type: 'onboarding',
    mode: 'interactive',
    status: 'active',
    created_at: '2024-03-01T09:00:00Z'
  },
  {
    id: '2',
    organization_id: 'pvt-1',
    journey_config_id: 'REKYC_XYZ789',
    journey_type: 'rekyc',
    mode: 'headless',
    status: 'active',
    created_at: '2024-03-05T11:00:00Z'
  }
];

export const mockJourneyConfigs = [
  {
    id: 'config-1',
    journey_config_id: 'ONBOARDING_ABC123',
    organization_id: 'gov-1',
    mode: 'interactive',
    journey_type: 'onboarding',
    non_visitor_onboarding: false,
    require_onboarding: true,
    passive_liveness: false,
    active_liveness: true
  }
];

export const mockUsers = [
  {
    id: 'user-1',
    email: 'admin@kycplatform.ae',
    name: 'Admin User',
    role: 'admin',
    organization_id: null
  },
  {
    id: 'user-2',
    email: 'ahmed@dubaipolice.gov.ae',
    name: 'Ahmed Al Maktoum',
    role: 'org_admin',
    organization_id: 'gov-1'
  }
];

export const mockAuditLogs = [
  {
    id: 'log-1',
    action: 'organization_created',
    entity_type: 'organization',
    entity_id: 'gov-1',
    user_id: 'user-1',
    timestamp: '2024-01-15T10:00:00Z',
    details: { name: 'Dubai Police' }
  },
  {
    id: 'log-2',
    action: 'journey_created',
    entity_type: 'journey',
    entity_id: '1',
    user_id: 'user-2',
    timestamp: '2024-03-01T09:00:00Z',
    details: { journey_config_id: 'ONBOARDING_ABC123' }
  }
];

export const mockFeatureFlags = [
  {
    id: 'flag-1',
    key: 'enable_biometric_verification',
    enabled: true,
    description: 'Enable biometric verification features'
  },
  {
    id: 'flag-2',
    key: 'enable_remote_onboarding',
    enabled: true,
    description: 'Enable remote onboarding capabilities'
  }
];
