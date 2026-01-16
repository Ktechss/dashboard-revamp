import { Building2, Settings, CreditCard } from 'lucide-react';

export const STEPS = [
  { number: 1, title: 'Organization Details', icon: Building2, description: 'Company & admin info' },
  { number: 2, title: 'Module Configuration', icon: Settings, description: 'Journey & verification setup' },
  { number: 3, title: 'Pricing & Credits', icon: CreditCard, description: 'Pricing configuration' },
  { number: 4, title: 'Additional Features', icon: Settings, description: 'Extra configurations' }
];

export const CHANNELS = [
  { id: 'sdk', label: 'SDK Based', description: 'Native SDK integration' },
  { id: 'remote_link', label: 'Remote Link', description: 'Web-based remote flow' },
  { id: 'api', label: 'Headless/API', description: 'Direct API integration' }
];

export const SERVICE_CATEGORIES = {
  kyc_service: {
    label: 'KYC Service',
    description: 'Identity verification services with journey configuration',
    configurable: true,
    hasDeliveryModes: true,
    services: [
      { id: 'onboarding', label: 'Onboarding', description: 'New customer registration' },
      { id: 'rekyc', label: 'Re-KYC', description: 'Periodic identity reverification' }
    ]
  },
  authentication_service: {
    label: 'Authentication Service',
    description: 'User authentication and verification services',
    configurable: true,
    hasDeliveryModes: true,
    services: [
      { id: 'authorise', label: 'Authorise', description: 'Transaction authorization' },
      { id: 'one_to_many', label: 'One-to-Many', description: 'Face search in database' }
    ]
  },
  validation_service: {
    label: 'Validation Service',
    description: 'EID and Passport validation with API and Batch options',
    configurable: 'validation',
    services: [
      { id: 'eid_validation', label: 'Emirates ID', description: 'Emirates ID validation' },
      { id: 'passport_validation', label: 'Passport', description: 'Passport validation' }
    ],
    processingModes: [
      { id: 'api', label: 'API Based', description: 'Real-time API validation' },
      { id: 'batch', label: 'Batch Processing', description: 'Bulk validation via CSV' }
    ]
  },
  additional_services: {
    label: 'Additional Services',
    description: 'Supplementary service modules',
    configurable: false,
    services: [
      {
        id: 'population_migration',
        label: 'Population Migration',
        description: 'Bulk data migration service',
        subOptions: [
          { id: 'biometric_verification', label: 'Biometric Verification', description: 'Include biometric identity verification' }
        ]
      }
    ]
  },
  api_modules: {
    label: 'API Modules',
    description: 'Individual API endpoints available for integration',
    configurable: false,
    hiddenByDefault: true,
    services: [
      { id: 'person_detail', label: 'Person Detail', description: 'Get person details' },
      { id: 'person_gov_photo', label: 'Person Gov Photo', description: 'Government photo retrieval' },
      { id: 'digital_eid', label: 'Digital EID', description: 'Digital Emirates ID' },
      { id: 'search_name_dob', label: 'Search Name/DOB', description: 'Search by name and date of birth' },
      { id: 'immigration_details', label: 'Immigration Details', description: 'Immigration status details' },
      { id: 'sponsor_details', label: 'Sponsor Details', description: 'Sponsor information' },
      { id: 'fingerprint_fetch', label: 'Fingerprint Fetch', description: 'Retrieve fingerprint data' },
      { id: 'fingerprint_match', label: 'Fingerprint Match', description: 'Match fingerprint data' },
      { id: 'face_compare', label: 'Face Compare', description: 'Compare two faces' },
      { id: 'face_person_match', label: 'Face Person Match', description: 'Match face to person record' },
      { id: 'document_ocr', label: 'Document OCR', description: 'Extract text from documents' },
      { id: 'person_live_photo', label: 'Person Live Photo', description: 'Capture live photo' },
      { id: 'person_live_image_exists', label: 'Person Live Image Exists', description: 'Check if live image exists' },
      { id: 'record_exists', label: 'Record Exists', description: 'Check if person record exists' },
      { id: 'person_authenticate', label: 'Person Authenticate', description: 'Authenticate person identity' },
      { id: 'customer_bio', label: 'Customer Bio', description: 'Customer biometric data' }
    ]
  }
};

export const DOCUMENT_TYPES = [
  { id: 'emirates_id', label: 'Emirates ID' },
  { id: 'passport', label: 'Passport' },
  { id: 'gcc_id', label: 'GCC ID' }
];

export const INPUT_METHODS = [
  { id: 'all', label: 'All (Scan + Manual)' },
  { id: 'scan', label: 'Scan Only' },
  { id: 'manual', label: 'Manual Only' }
];

export const VERIFICATION_METHODS = [
  { id: 'face', label: 'Face Recognition' },
  { id: 'fingerprint', label: 'Fingerprint' }
];

export const RESPONSE_TEMPLATE_FIELDS = {
  personal_info: {
    label: 'Personal Info',
    fields: [
      'current_nationality', 'full_name_ar', 'full_name_en', 'first_name_en', 'first_name_ar',
      'second_name_en', 'second_name_ar', 'family_name_ar', 'family_name_en', 'mother_name_ar',
      'mother_name_en', 'date_of_birth', 'hijri_date_of_birth', 'person_class', 'gender_ar',
      'gender_en', 'marital_status_ar', 'marital_status_en', 'place_of_birth_ar', 'place_of_birth_en',
      'mobile_no', 'title_en', 'title_ar', 'inside_uae', 'immigration_status', 'occupation_ar',
      'occupation_en', 'uid_number'
    ]
  },
  active_passport: {
    label: 'Active Passport',
    fields: [
      'document_type', 'document_no', 'document_nationality', 'document_nationality_abbr',
      'document_issue_country', 'document_issue_country_abbr', 'issue_date', 'expiry_date'
    ]
  },
  person_contact_details: {
    label: 'Person Contact Details',
    fields: [
      'emirate_en', 'emirate_ar', 'city_ar', 'city_en', 'area_ar', 'area_en', 'street_ar',
      'street_en', 'po_box', 'mobile_no', 'home_phone', 'work_phone'
    ]
  },
  travel_detail: {
    label: 'Travel Detail',
    fields: [
      'is_inside_uae', 'travel_type', 'travel_date', 'travel_time', 'travel_document_no',
      'travel_document_issue_date', 'travel_document_expiry_date'
    ]
  },
  residence_info: {
    label: 'Residence Info',
    fields: [
      'residence_class_en', 'residence_class_ar', 'residence_department_en', 'residence_department_ar',
      'accompany_count', 'sponsor_name_en', 'sponsor_name_ar', 'issue_date', 'expiry_date',
      'emirates_id_number', 'document_no'
    ]
  },
  family_book: {
    label: 'Family Book',
    fields: [
      'khulasit_qaid_no', 'family_book_no', 'family_book_start_date', 'family_book_relation'
    ]
  },
  sponsor_details: {
    label: 'Sponsor Details',
    fields: [
      'name_en', 'name_ar', 'department_en', 'department_ar', 'sponsor_no', 'sponsor_type_en',
      'sponsor_type_ar', 'sponsor_idn', 'sponsor_nationality', 'sponsor_nationality_abbr'
    ]
  },
  trade_license: {
    label: 'Trade License',
    fields: ['trade_license']
  },
  immigration_file: {
    label: 'Immigration File',
    fields: [
      'status', 'file_type_en', 'file_type_ar', 'file_number', 'issue_place', 'issue_date', 'expiry_date'
    ]
  },
  sponsor_contact_details: {
    label: 'Sponsor Contact Details',
    fields: [
      'emirate_ar', 'emirate_en', 'city_ar', 'city_en', 'area_ar', 'area_en', 'street_ar',
      'street_en', 'po_box', 'email', 'mobile_no', 'home_phone', 'work_phone'
    ]
  },
  active_visa: {
    label: 'Active Visa',
    fields: [
      'visa_type', 'visa_department', 'passport_no', 'passport_expiry_date', 'passport_issue_place',
      'visa_status', 'issue_date', 'created_date', 'validity_date', 'expiry_date'
    ]
  },
  documents: {
    label: 'Documents',
    fields: [
      'passport_image', 'gcc_id_image', 'person_face', 'digital_eid', 'digital_signature', 'active_visa'
    ]
  }
};

// Helper functions
export const generateHash = () => Math.random().toString(36).substring(2, 10).toUpperCase();

export const getConfigurableServices = () => {
  const services = [];
  Object.entries(SERVICE_CATEGORIES).forEach(([categoryKey, category]) => {
    if (category.configurable === true && category.services) {
      services.push(...category.services.map(s => ({ ...s, category: categoryKey })));
    }
  });
  return services;
};

export const JOURNEY_TYPES = getConfigurableServices();

export const createDefaultJourneyConfig = (journeyType) => ({
  journey_config_id: `${journeyType.toUpperCase()}_${generateHash()}`,
  channels: [],
  documents_allowed: {
    emirates_id: { enabled: true, input_method: 'all' },
    passport: { enabled: true, input_method: 'all' },
    gcc_id: { enabled: false, input_method: 'all' }
  },
  verification_methods: ['face'],
  response_template: {
    enabled_fields: {},
    format: 'json',
    webhook_url: ''
  }
});

export const DEFAULT_FORM_DATA = {
  // Organization Details
  name: '',
  organization_category: '',
  registration_number: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: 'UAE',

  // Root User
  root_user_same_as_contact: true,
  primary_contact_name: '',
  primary_contact_email: '',
  primary_contact_phone: '',
  root_password: '',

  // Module Configuration
  enabled_journeys: [],
  journey_configs: {},

  // Validation Service Configuration
  validation_config: {
    eid_validation: {
      enabled: false,
      api_enabled: false,
      batch_enabled: false,
      total_hit_limit: 100000,
      api_price_per_call: 1,
      api_hit_limit: 70000,
      batch_price_per_record: 0.5,
      batch_hit_limit: 30000,
      batch_max_size: 1000,
      batch_max_files: 10
    },
    passport_validation: {
      enabled: false,
      api_enabled: false,
      batch_enabled: false,
      total_hit_limit: 50000,
      api_price_per_call: 1,
      api_hit_limit: 35000,
      batch_price_per_record: 0.5,
      batch_hit_limit: 15000,
      batch_max_size: 500,
      batch_max_files: 10
    }
  },

  // Non-configurable services
  enabled_services: {
    population_migration: false,
    biometric_verification: false,
    person_detail: false,
    person_gov_photo: false,
    digital_eid: false,
    search_name_dob: false,
    immigration_details: false,
    sponsor_details: false,
    fingerprint_fetch: false,
    fingerprint_match: false,
    face_compare: false,
    face_person_match: false,
    document_ocr: false,
    person_live_photo: false,
    person_live_image_exists: false,
    record_exists: false,
    person_authenticate: false,
    customer_bio: false
  },

  show_api_modules: false,

  // Org-level configs
  org_configs: {
    non_visitor_onboarding: false,
    require_onboarding: true,
    generate_certificate: true,
    proactive_monitoring: true,
    sandbox_mode: false,
    eligible_for_finance: false,
    watermark_noise_compression: true,
    active_liveness: true,
    passive_liveness: false
  },

  // Pricing
  pricing: {
    onboarding: { price_per_transaction: 5.00, included_transactions: 1000 },
    rekyc: { price_per_transaction: 3.00, included_transactions: 500 },
    authorise: { price_per_transaction: 2.00, included_transactions: 2000 },
    one_to_many: { price_per_transaction: 1.00, included_transactions: 5000 },
    validation: { price_per_transaction: 0.50, included_transactions: 10000 }
  },
  initial_credits: 10000,

  // Transaction Keys
  api_key: '',
  secret_key: '',
  keys_generated: false
};
