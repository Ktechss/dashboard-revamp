import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { toast } from 'sonner';

// Import modular components
import {
  STEPS,
  CHANNELS,
  SERVICE_CATEGORIES,
  DOCUMENT_TYPES,
  INPUT_METHODS,
  VERIFICATION_METHODS,
  RESPONSE_TEMPLATE_FIELDS,
  JOURNEY_TYPES,
  DEFAULT_FORM_DATA,
  createDefaultJourneyConfig,
  getConfigurableServices
} from './private';

import OnboardingSidebar from './private/OnboardingSidebar';
import StepLayout from './private/StepLayout';
import OrganizationDetailsStep from './private/OrganizationDetailsStep';
import ServiceSelectionView from './private/ServiceSelectionView';
import PricingCreditsStep from './private/PricingCreditsStep';
import AdditionalFeaturesStep from './private/AdditionalFeaturesStep';

// Validation helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^\+971\d{9}$/.test(phone.replace(/\s/g, ''));
const validatePassword = (password) => {
  return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);
};

const formatPhoneNumber = (value) => {
  let digits = value.replace(/[^\d+]/g, '');
  if (!digits.startsWith('+971')) digits = '+971';
  const numberPart = digits.slice(4).replace(/\D/g, '').slice(0, 9);
  if (numberPart.length === 0) return '+971';
  if (numberPart.length <= 2) return `+971 ${numberPart}`;
  if (numberPart.length <= 5) return `+971 ${numberPart.slice(0, 2)} ${numberPart.slice(2)}`;
  return `+971 ${numberPart.slice(0, 2)} ${numberPart.slice(2, 5)} ${numberPart.slice(5)}`;
};

const formatFieldName = (field) => {
  return field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function PrivateOnboarding({ onBack }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [moduleSubStep, setModuleSubStep] = useState(0);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [formData, setFormData] = useState({
    ...DEFAULT_FORM_DATA,
    // Demo data for testing
    name: 'Acme Financial Services',
    organization_category: 'Financial',
    registration_number: 'REG-2024-78523',
    email: 'contact@acmefinancial.ae',
    phone: '+971 50 123 4567',
    address: 'Tower 5, Floor 12, Business Bay',
    city: 'Dubai',
    country: 'UAE',
    root_user_same_as_contact: true,
    primary_contact_name: 'Ahmed Al Rashid',
    primary_contact_email: 'ahmed.rashid@acmefinancial.ae',
    primary_contact_phone: '+971 55 987 6543',
    root_password: 'Demo@1234',
    enabled_journeys: ['onboarding'],
    journey_configs: {
      onboarding: createDefaultJourneyConfig('onboarding')
    }
  });
  const [errors, setErrors] = useState({});

  // Mutation for creating organization
  const createOrgMutation = useMutation({
    mutationFn: async (data) => {
      return new Promise((resolve) => setTimeout(() => resolve({ id: 'pvt-new', ...data }), 1000));
    },
    onSuccess: () => {
      toast.success('Private organization created successfully!');
      navigate(createPageUrl('Home'));
    },
    onError: (error) => {
      toast.error('Failed to create organization: ' + error.message);
    }
  });

  // Form handlers
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handlePhoneChange = (field, value) => {
    handleChange(field, formatPhoneNumber(value));
  };

  const handleOrgConfigChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      org_configs: { ...prev.org_configs, [key]: value }
    }));
  };

  const handlePricingChange = (journeyType, field, value) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [journeyType]: { ...prev.pricing[journeyType], [field]: parseFloat(value) || 0 }
      }
    }));
  };

  // Journey handlers
  const toggleJourney = (journeyId) => {
    setFormData(prev => {
      const isEnabled = prev.enabled_journeys.includes(journeyId);
      const newEnabledJourneys = isEnabled
        ? prev.enabled_journeys.filter(j => j !== journeyId)
        : [...prev.enabled_journeys, journeyId];

      const newJourneyConfigs = { ...prev.journey_configs };
      if (!isEnabled && !newJourneyConfigs[journeyId]) {
        newJourneyConfigs[journeyId] = createDefaultJourneyConfig(journeyId);
      } else if (isEnabled) {
        delete newJourneyConfigs[journeyId];
      }

      return { ...prev, enabled_journeys: newEnabledJourneys, journey_configs: newJourneyConfigs };
    });
  };

  const toggleChannel = (journeyType, channelId) => {
    setFormData(prev => {
      const currentChannels = prev.journey_configs[journeyType]?.channels || [];
      const newChannels = currentChannels.includes(channelId)
        ? currentChannels.filter(c => c !== channelId)
        : [...currentChannels, channelId];
      return {
        ...prev,
        journey_configs: {
          ...prev.journey_configs,
          [journeyType]: { ...prev.journey_configs[journeyType], channels: newChannels }
        }
      };
    });
  };

  const toggleJourneyDocument = (journeyType, docId) => {
    setFormData(prev => ({
      ...prev,
      journey_configs: {
        ...prev.journey_configs,
        [journeyType]: {
          ...prev.journey_configs[journeyType],
          documents_allowed: {
            ...prev.journey_configs[journeyType].documents_allowed,
            [docId]: {
              ...prev.journey_configs[journeyType].documents_allowed[docId],
              enabled: !prev.journey_configs[journeyType].documents_allowed[docId].enabled
            }
          }
        }
      }
    }));
  };

  const changeJourneyDocumentInputMethod = (journeyType, docId, method) => {
    setFormData(prev => ({
      ...prev,
      journey_configs: {
        ...prev.journey_configs,
        [journeyType]: {
          ...prev.journey_configs[journeyType],
          documents_allowed: {
            ...prev.journey_configs[journeyType].documents_allowed,
            [docId]: { ...prev.journey_configs[journeyType].documents_allowed[docId], input_method: method }
          }
        }
      }
    }));
  };

  const toggleJourneyVerification = (journeyType, methodId) => {
    setFormData(prev => {
      const currentMethods = prev.journey_configs[journeyType]?.verification_methods || [];
      const newMethods = currentMethods.includes(methodId)
        ? currentMethods.filter(m => m !== methodId)
        : [...currentMethods, methodId];
      return {
        ...prev,
        journey_configs: {
          ...prev.journey_configs,
          [journeyType]: { ...prev.journey_configs[journeyType], verification_methods: newMethods }
        }
      };
    });
  };

  const getJourneyEnabledDocuments = (journeyType) => {
    const docs = formData.journey_configs[journeyType]?.documents_allowed || {};
    return Object.entries(docs).filter(([_, config]) => config.enabled).map(([id]) => id);
  };

  // Response template handlers
  const toggleResponseField = (journeyType, category, field) => {
    setFormData(prev => {
      const currentFields = prev.journey_configs[journeyType]?.response_template?.enabled_fields?.[category] || [];
      const newFields = currentFields.includes(field)
        ? currentFields.filter(f => f !== field)
        : [...currentFields, field];
      return {
        ...prev,
        journey_configs: {
          ...prev.journey_configs,
          [journeyType]: {
            ...prev.journey_configs[journeyType],
            response_template: {
              ...prev.journey_configs[journeyType]?.response_template,
              enabled_fields: {
                ...prev.journey_configs[journeyType]?.response_template?.enabled_fields,
                [category]: newFields
              }
            }
          }
        }
      };
    });
  };

  const toggleAllFieldsInCategory = (journeyType, category, selectAll) => {
    const allFields = RESPONSE_TEMPLATE_FIELDS[category].fields;
    setFormData(prev => ({
      ...prev,
      journey_configs: {
        ...prev.journey_configs,
        [journeyType]: {
          ...prev.journey_configs[journeyType],
          response_template: {
            ...prev.journey_configs[journeyType]?.response_template,
            enabled_fields: {
              ...prev.journey_configs[journeyType]?.response_template?.enabled_fields,
              [category]: selectAll ? [...allFields] : []
            }
          }
        }
      }
    }));
  };

  const getCategoryFieldCount = (journeyType, category) => {
    return formData.journey_configs[journeyType]?.response_template?.enabled_fields?.[category]?.length || 0;
  };

  const getTotalSelectedFields = (journeyType) => {
    const enabledFields = formData.journey_configs[journeyType]?.response_template?.enabled_fields || {};
    return Object.values(enabledFields).reduce((sum, fields) => sum + fields.length, 0);
  };

  const toggleCategoryExpand = (categoryKey) => {
    setExpandedCategories(prev => ({ ...prev, [categoryKey]: !prev[categoryKey] }));
  };

  // Service handlers
  const toggleService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      enabled_services: { ...prev.enabled_services, [serviceId]: !prev.enabled_services[serviceId] }
    }));
  };

  const toggleAllServicesInCategory = (categoryKey, enable) => {
    const category = SERVICE_CATEGORIES[categoryKey];
    if (!category || category.configurable) return;

    setFormData(prev => {
      const newEnabledServices = { ...prev.enabled_services };
      category.services.forEach(service => {
        newEnabledServices[service.id] = enable;
      });
      return { ...prev, enabled_services: newEnabledServices };
    });
  };

  const getEnabledServiceCount = (categoryKey) => {
    const category = SERVICE_CATEGORIES[categoryKey];
    if (!category) return 0;
    return category.services.filter(s => formData.enabled_services[s.id]).length;
  };

  const toggleApiModulesVisibility = () => {
    setFormData(prev => ({ ...prev, show_api_modules: !prev.show_api_modules }));
  };

  // Validation handlers
  const toggleValidationApi = (apiId) => {
    setFormData(prev => ({
      ...prev,
      validation_config: {
        ...prev.validation_config,
        [apiId]: { ...prev.validation_config[apiId], enabled: !prev.validation_config[apiId].enabled }
      }
    }));
  };

  const toggleValidationProcessingMode = (apiId, modeType) => {
    setFormData(prev => ({
      ...prev,
      validation_config: {
        ...prev.validation_config,
        [apiId]: {
          ...prev.validation_config[apiId],
          [`${modeType}_enabled`]: !prev.validation_config[apiId][`${modeType}_enabled`]
        }
      }
    }));
  };

  const updateValidationApiConfig = (apiId, field, value) => {
    setFormData(prev => ({
      ...prev,
      validation_config: {
        ...prev.validation_config,
        [apiId]: { ...prev.validation_config[apiId], [field]: value }
      }
    }));
  };

  const getEnabledValidationApisCount = () => {
    return Object.values(formData.validation_config).filter(api => api.enabled).length;
  };

  const getEnabledValidationApis = () => {
    return Object.keys(formData.validation_config).filter(apiId => formData.validation_config[apiId]?.enabled);
  };

  // Step validation
  const validateStep = (step, subStep = 0) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.name || formData.name.length < 2) newErrors.name = 'Organization name is required';
        if (!formData.organization_category) newErrors.organization_category = 'Category is required';
        if (!formData.email || !validateEmail(formData.email)) newErrors.email = 'Valid email is required';
        if (!validatePhone(formData.phone)) newErrors.phone = 'Valid UAE phone is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.primary_contact_name) newErrors.primary_contact_name = 'Contact name is required';
        if (!formData.primary_contact_email || !validateEmail(formData.primary_contact_email)) {
          newErrors.primary_contact_email = 'Valid email is required';
        }
        if (!validatePhone(formData.primary_contact_phone)) {
          newErrors.primary_contact_phone = 'Valid UAE phone is required';
        }
        if (!formData.root_password || !validatePassword(formData.root_password)) {
          newErrors.root_password = 'Password must be 8+ chars with uppercase, lowercase, number, special char';
        }
        break;

      case 2:
        if (subStep === 0) {
          if (formData.enabled_journeys.length === 0 && getEnabledValidationApisCount() === 0) {
            newErrors.enabled_journeys = 'Select at least one service';
          }
        }
        break;

      case 3:
        if (formData.initial_credits < 0) newErrors.initial_credits = 'Credits cannot be negative';
        break;

      case 4:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const handleNext = () => {
    if (currentStep === 2) {
      if (validateStep(2, moduleSubStep)) {
        const totalConfigSteps = formData.enabled_journeys.length + getEnabledValidationApis().length;

        if (moduleSubStep === 0) {
          if (totalConfigSteps > 0) {
            setModuleSubStep(1);
          } else {
            setCurrentStep(3);
          }
        } else if (moduleSubStep < totalConfigSteps) {
          setModuleSubStep(prev => prev + 1);
        } else {
          setModuleSubStep(0);
          setCurrentStep(3);
        }
      }
    } else {
      if (validateStep(currentStep)) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      if (moduleSubStep > 0) {
        setModuleSubStep(prev => prev - 1);
      } else {
        setCurrentStep(1);
      }
    } else if (currentStep > 1) {
      if (currentStep === 3) {
        setCurrentStep(2);
        setModuleSubStep(formData.enabled_journeys.length + getEnabledValidationApis().length);
      } else {
        setCurrentStep(prev => prev - 1);
      }
    } else {
      onBack();
    }
  };

  const handleSubmit = () => {
    if (validateStep(4)) {
      createOrgMutation.mutate(formData);
    }
  };

  // Render Journey Configuration View
  const renderJourneyConfig = () => {
    const journeyType = formData.enabled_journeys[moduleSubStep - 1];
    const journeyConfig = formData.journey_configs[journeyType];
    const journeyLabel = JOURNEY_TYPES.find(jt => jt.id === journeyType)?.label || journeyType;
    const totalSteps = formData.enabled_journeys.length + getEnabledValidationApis().length;

    return (
      <>
        {/* Header */}
        <div className="bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{journeyLabel} Configuration</h2>
              <code className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                {journeyConfig?.journey_config_id}
              </code>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(totalSteps)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-1 rounded ${
                      idx < moduleSubStep - 1 ? 'bg-slate-900' : idx === moduleSubStep - 1 ? 'bg-sky-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-slate-900">{formData.name || 'Organization'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column: Documents & Verification */}
            <div className="space-y-6">
              {/* Documents */}
              <div className="bg-white rounded-xl border shadow-sm p-4">
                <h3 className="font-semibold mb-4">Documents Allowed</h3>
                <div className="space-y-2">
                  {DOCUMENT_TYPES.map((doc) => {
                    const isEnabled = journeyConfig?.documents_allowed?.[doc.id]?.enabled;
                    return (
                      <div
                        key={doc.id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                          isEnabled ? 'bg-sky-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <Checkbox
                          checked={isEnabled}
                          onCheckedChange={() => toggleJourneyDocument(journeyType, doc.id)}
                        />
                        <label className="flex-1 text-sm cursor-pointer">{doc.label}</label>
                        {isEnabled && (
                          <Select
                            value={journeyConfig?.documents_allowed?.[doc.id]?.input_method || 'all'}
                            onValueChange={(v) => changeJourneyDocumentInputMethod(journeyType, doc.id, v)}
                          >
                            <SelectTrigger className="h-7 text-xs w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {INPUT_METHODS.map(method => (
                                <SelectItem key={method.id} value={method.id}>{method.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    );
                  })}
                </div>
                {errors.documents_allowed && (
                  <p className="text-sm text-red-500 mt-2">{errors.documents_allowed}</p>
                )}
              </div>

              {/* Verification */}
              <div className="bg-white rounded-xl border shadow-sm p-4">
                <h3 className="font-semibold mb-4">Verification Methods</h3>
                <div className="space-y-2">
                  {VERIFICATION_METHODS.map((method) => {
                    const isEnabled = journeyConfig?.verification_methods?.includes(method.id);
                    return (
                      <div
                        key={method.id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                          isEnabled ? 'bg-sky-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleJourneyVerification(journeyType, method.id)}
                      >
                        <Checkbox checked={isEnabled} />
                        <label className="text-sm cursor-pointer">{method.label}</label>
                      </div>
                    );
                  })}
                </div>
                {errors.verification_methods && (
                  <p className="text-sm text-red-500 mt-2">{errors.verification_methods}</p>
                )}
              </div>
            </div>

            {/* Right Column: Channels */}
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <h3 className="font-semibold mb-4">Delivery Channels</h3>
              <div className="space-y-2">
                {CHANNELS.map((channel) => {
                  const isEnabled = journeyConfig?.channels?.includes(channel.id);
                  return (
                    <div
                      key={channel.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                        isEnabled ? 'bg-sky-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleChannel(journeyType, channel.id)}
                    >
                      <Checkbox checked={isEnabled} />
                      <div>
                        <p className="text-sm font-medium">{channel.label}</p>
                        <p className="text-xs text-gray-400">{channel.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Response Template */}
          <div className="mt-6 bg-white rounded-xl border shadow-sm">
            <div className="px-4 py-4 flex items-center justify-between border-b">
              <div>
                <h3 className="font-semibold">Response Template</h3>
                <p className="text-xs text-gray-500">
                  {getTotalSelectedFields(journeyType)} fields selected
                </p>
              </div>
            </div>
            <div className="px-4 pb-4 flex flex-wrap gap-3 max-h-[400px] overflow-y-auto items-start pt-4">
              {Object.entries(RESPONSE_TEMPLATE_FIELDS).map(([categoryKey, category]) => {
                const isExpanded = expandedCategories[categoryKey];
                const selectedCount = getCategoryFieldCount(journeyType, categoryKey);
                const totalCount = category.fields.length;

                return (
                  <div key={categoryKey} className="bg-gray-50 rounded-lg overflow-hidden w-[calc(33.333%-0.5rem)]">
                    <div
                      className="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleCategoryExpand(categoryKey)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{category.label}</span>
                        <Badge variant="secondary" className="text-xs">
                          {selectedCount}/{totalCount}
                        </Badge>
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                    {isExpanded && (
                      <div className="px-3 pb-3 space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-6 text-xs"
                          onClick={() => toggleAllFieldsInCategory(journeyType, categoryKey, selectedCount < totalCount)}
                        >
                          {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
                        </Button>
                        {category.fields.map((field) => {
                          const isSelected = formData.journey_configs[journeyType]?.response_template?.enabled_fields?.[categoryKey]?.includes(field);
                          return (
                            <div
                              key={field}
                              className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-xs ${
                                isSelected ? 'bg-sky-100' : 'hover:bg-gray-100'
                              }`}
                              onClick={() => toggleResponseField(journeyType, categoryKey, field)}
                            >
                              <Checkbox checked={isSelected} className="h-3 w-3" />
                              <span className="truncate">{formatFieldName(field)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} className="bg-slate-900 hover:bg-slate-800">
              {moduleSubStep < totalSteps ? 'Next Configuration' : 'Continue to Pricing'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </>
    );
  };

  // Render Validation Configuration View
  const renderValidationConfig = () => {
    const validationServices = getEnabledValidationApis();
    const validationIndex = moduleSubStep - formData.enabled_journeys.length - 1;
    const serviceId = validationServices[validationIndex];
    const serviceConfig = SERVICE_CATEGORIES.validation_service.services.find(s => s.id === serviceId);
    const config = formData.validation_config[serviceId];
    const totalSteps = formData.enabled_journeys.length + validationServices.length;

    if (!serviceConfig || !config) return null;

    return (
      <>
        {/* Header */}
        <div className="bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{serviceConfig.label} Validation</h2>
                <Badge className="bg-sky-100 text-sky-700 text-xs">Validation Service</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">{serviceConfig.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(totalSteps)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-1 rounded ${
                      idx < moduleSubStep - 1 ? 'bg-slate-900' : idx === moduleSubStep - 1 ? 'bg-sky-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-slate-900">{formData.name || 'Organization'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-5">
            {/* Processing Modes */}
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="px-4 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Processing Modes</h4>
                  <p className="text-gray-500 text-xs">Select how this service will be accessed</p>
                </div>
              </div>
              <div className="px-4 pb-4 grid grid-cols-2 gap-4">
                {SERVICE_CATEGORIES.validation_service.processingModes.map((mode) => {
                  const isEnabled = config[`${mode.id}_enabled`];
                  return (
                    <div
                      key={mode.id}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                        isEnabled ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleValidationProcessingMode(serviceId, mode.id)}
                    >
                      <div>
                        <p className="font-medium text-sm">{mode.label}</p>
                        <p className="text-xs text-gray-500">{mode.description}</p>
                      </div>
                      <Switch checked={isEnabled} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* API Configuration */}
            {config.api_enabled && (
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="px-4 py-4 border-b">
                  <h4 className="font-semibold text-slate-800">API Configuration</h4>
                </div>
                <div className="px-4 py-4 grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Price per Call (AED)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={config.api_price_per_call}
                      onChange={(e) => updateValidationApiConfig(serviceId, 'api_price_per_call', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">API Hit Limit</Label>
                    <Input
                      type="number"
                      value={config.api_hit_limit}
                      onChange={(e) => updateValidationApiConfig(serviceId, 'api_hit_limit', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Batch Configuration */}
            {config.batch_enabled && (
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="px-4 py-4 border-b">
                  <h4 className="font-semibold text-slate-800">Batch Configuration</h4>
                </div>
                <div className="px-4 py-4 grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Price per Record (AED)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={config.batch_price_per_record}
                      onChange={(e) => updateValidationApiConfig(serviceId, 'batch_price_per_record', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Batch Hit Limit</Label>
                    <Input
                      type="number"
                      value={config.batch_hit_limit}
                      onChange={(e) => updateValidationApiConfig(serviceId, 'batch_hit_limit', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Max Records per Batch</Label>
                    <Input
                      type="number"
                      value={config.batch_max_size}
                      onChange={(e) => updateValidationApiConfig(serviceId, 'batch_max_size', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Max Files</Label>
                    <Input
                      type="number"
                      value={config.batch_max_files}
                      onChange={(e) => updateValidationApiConfig(serviceId, 'batch_max_files', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} className="bg-slate-900 hover:bg-slate-800">
              {moduleSubStep < totalSteps ? 'Next Configuration' : 'Continue to Pricing'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <OnboardingSidebar
        currentStep={currentStep}
        moduleSubStep={moduleSubStep}
        formData={formData}
        getEnabledValidationApis={getEnabledValidationApis}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {currentStep === 2 ? (
          <div className="h-full flex flex-col">
            {moduleSubStep === 0 ? (
              <ServiceSelectionView
                formData={formData}
                errors={errors}
                onToggleJourney={toggleJourney}
                onToggleValidationApi={toggleValidationApi}
                onToggleService={toggleService}
                onToggleApiModulesVisibility={toggleApiModulesVisibility}
                onToggleAllServicesInCategory={toggleAllServicesInCategory}
                getEnabledServiceCount={getEnabledServiceCount}
                getEnabledValidationApisCount={getEnabledValidationApisCount}
                onBack={handleBack}
                onNext={handleNext}
              />
            ) : moduleSubStep <= formData.enabled_journeys.length ? (
              renderJourneyConfig()
            ) : (
              renderValidationConfig()
            )}
          </div>
        ) : (
          <StepLayout
            currentStep={currentStep}
            orgName={formData.name}
            showOrgName={currentStep !== 1}
            onBack={handleBack}
            onNext={currentStep === 4 ? handleSubmit : handleNext}
            isLastStep={currentStep === 4}
            isSubmitting={createOrgMutation.isPending}
            submitDisabled={!formData.keys_generated}
          >
            {currentStep === 1 && (
              <OrganizationDetailsStep
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onPhoneChange={handlePhoneChange}
              />
            )}
            {currentStep === 3 && (
              <PricingCreditsStep
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onPricingChange={handlePricingChange}
              />
            )}
            {currentStep === 4 && (
              <AdditionalFeaturesStep
                formData={formData}
                onOrgConfigChange={handleOrgConfigChange}
              />
            )}
          </StepLayout>
        )}
      </div>
    </div>
  );
}
