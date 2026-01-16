import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ArrowRight, UserCheck, Fingerprint, FileCheck, Layers, Code } from 'lucide-react';
import { SERVICE_CATEGORIES } from './constants';

export default function ServiceSelectionView({
  formData,
  errors,
  onToggleJourney,
  onToggleValidationApi,
  onToggleService,
  onToggleApiModulesVisibility,
  onToggleAllServicesInCategory,
  getEnabledServiceCount,
  getEnabledValidationApisCount,
  onBack,
  onNext
}) {
  const SERVICE_ICONS = {
    kyc_service: UserCheck,
    authentication_service: Fingerprint,
    validation_service: FileCheck,
    additional_services: Layers,
    api_modules: Code
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Module Configuration</h2>
            <p className="text-gray-500 mt-1">Select and configure services for this organization</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900">{formData.name || 'Organization'}</p>
              <p className="text-xs text-gray-500">
                {formData.enabled_journeys.length + getEnabledValidationApisCount()} Services Selected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 bg-slate-50">
        {/* Configurable Services Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Configurable Services</h3>
            <Badge className="bg-sky-100 text-sky-700 text-xs">Requires Setup</Badge>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {/* KYC Service Card */}
            <ServiceCard
              icon={SERVICE_ICONS.kyc_service}
              title={SERVICE_CATEGORIES.kyc_service.label}
              description="Identity verification journeys"
              services={SERVICE_CATEGORIES.kyc_service.services}
              enabledServices={formData.enabled_journeys}
              onToggle={onToggleJourney}
            />

            {/* Authentication Service Card */}
            <ServiceCard
              icon={SERVICE_ICONS.authentication_service}
              title={SERVICE_CATEGORIES.authentication_service.label}
              description="User verification methods"
              services={SERVICE_CATEGORIES.authentication_service.services}
              enabledServices={formData.enabled_journeys}
              onToggle={onToggleJourney}
              error={errors.enabled_journeys}
            />

            {/* Validation Service Card */}
            <ServiceCard
              icon={SERVICE_ICONS.validation_service}
              title={SERVICE_CATEGORIES.validation_service.label}
              description="Document validation APIs"
              services={SERVICE_CATEGORIES.validation_service.services}
              enabledServices={Object.keys(formData.validation_config).filter(k => formData.validation_config[k]?.enabled)}
              onToggle={onToggleValidationApi}
            />
          </div>
        </div>

        {/* Other Services Section */}
        <div className="grid grid-cols-2 gap-5">
          {/* Additional Services Card */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="px-4 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">{SERVICE_CATEGORIES.additional_services.label}</h4>
                <p className="text-gray-500 text-xs">Extended service options</p>
              </div>
            </div>
            <div className="px-4 pb-4">
              {SERVICE_CATEGORIES.additional_services.services.map((service) => (
                <div key={service.id}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                      formData.enabled_services[service.id] ? 'bg-sky-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onToggleService(service.id)}
                  >
                    <Checkbox
                      checked={formData.enabled_services[service.id]}
                      onCheckedChange={() => onToggleService(service.id)}
                    />
                    <div className="flex-1">
                      <span className="font-medium text-sm">{service.label}</span>
                      <p className="text-xs text-gray-400">{service.description}</p>
                    </div>
                  </div>

                  {/* Sub-options */}
                  {formData.enabled_services[service.id] && service.subOptions && (
                    <div className="ml-8 mt-1.5 space-y-1.5">
                      {service.subOptions.map((subOption) => (
                        <div
                          key={subOption.id}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                            formData.enabled_services[subOption.id] ? 'bg-sky-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => onToggleService(subOption.id)}
                        >
                          <Checkbox
                            checked={formData.enabled_services[subOption.id]}
                            onCheckedChange={() => onToggleService(subOption.id)}
                            className="h-3.5 w-3.5"
                          />
                          <div className="flex-1">
                            <span className="text-sm">{subOption.label}</span>
                            <p className="text-xs text-gray-400">{subOption.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">Optional</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* API Modules Card */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div
              className="px-4 py-4 flex items-center justify-between cursor-pointer"
              onClick={onToggleApiModulesVisibility}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-800">{SERVICE_CATEGORIES.api_modules.label}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {getEnabledServiceCount('api_modules')}/{SERVICE_CATEGORIES.api_modules.services.length}
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-xs">Individual API endpoints</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {formData.show_api_modules && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      const allEnabled = getEnabledServiceCount('api_modules') === SERVICE_CATEGORIES.api_modules.services.length;
                      onToggleAllServicesInCategory('api_modules', !allEnabled);
                    }}
                  >
                    {getEnabledServiceCount('api_modules') === SERVICE_CATEGORIES.api_modules.services.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </Button>
                )}
                <Switch
                  checked={formData.show_api_modules}
                  onCheckedChange={onToggleApiModulesVisibility}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className={`px-4 pb-4 transition-all ${formData.show_api_modules ? '' : 'opacity-50'}`}>
              <div className="grid grid-cols-2 gap-1">
                {SERVICE_CATEGORIES.api_modules.services.map((service) => (
                  <div
                    key={service.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                      formData.enabled_services[service.id] ? 'bg-sky-50' : 'hover:bg-gray-50'
                    } ${!formData.show_api_modules ? 'pointer-events-none' : ''}`}
                    onClick={() => onToggleService(service.id)}
                  >
                    <Checkbox
                      checked={formData.enabled_services[service.id]}
                      onCheckedChange={() => onToggleService(service.id)}
                      className="h-4 w-4"
                      disabled={!formData.show_api_modules}
                    />
                    <span className="text-xs truncate">{service.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white px-6 py-4">
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={onNext} className="bg-slate-900 hover:bg-slate-800">
            Configure Selected Services
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </>
  );
}

// Reusable Service Card Component
function ServiceCard({ icon: Icon, title, description, services, enabledServices, onToggle, error }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="px-4 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">{title}</h4>
          <p className="text-gray-500 text-xs">{description}</p>
        </div>
      </div>
      <div className="px-4 pb-4 space-y-1.5">
        {services.map((service) => {
          const isEnabled = enabledServices.includes(service.id);
          return (
            <div
              key={service.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                isEnabled ? 'bg-sky-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => onToggle(service.id)}
            >
              <Checkbox checked={isEnabled} onCheckedChange={() => onToggle(service.id)} />
              <div className="flex-1">
                <span className="font-medium text-sm">{service.label}</span>
                <p className="text-xs text-gray-400">{service.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      {error && <p className="text-sm text-red-500 px-4 pb-3">{error}</p>}
    </div>
  );
}
