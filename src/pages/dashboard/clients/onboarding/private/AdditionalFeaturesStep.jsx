import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';

const ORG_CONFIG_OPTIONS = {
  non_visitor_onboarding: { label: 'Non-Visitor Onboarding', description: 'Allow onboarding for non-visitors' },
  require_onboarding: { label: 'Require Onboarding', description: 'Mandate onboarding process' },
  generate_certificate: { label: 'Generate Certificate', description: 'Auto-generate verification certificates' },
  proactive_monitoring: { label: 'Proactive Monitoring', description: 'Enable proactive transaction monitoring' },
  sandbox_mode: { label: 'Sandbox Mode', description: 'Enable testing environment' },
  eligible_for_finance: { label: 'Eligible for Finance', description: 'Allow financial services' },
  watermark_noise_compression: { label: 'Watermark Compression', description: 'Apply watermark noise compression' },
  active_liveness: { label: 'Active Liveness', description: 'Require active liveness check' },
  passive_liveness: { label: 'Passive Liveness', description: 'Enable passive liveness detection' }
};

export default function AdditionalFeaturesStep({ formData, onOrgConfigChange }) {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Organization Options</h4>
            <p className="text-gray-500 text-xs">Enable or disable additional features</p>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {Object.entries(ORG_CONFIG_OPTIONS).map(([key, config]) => (
              <div
                key={key}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                  formData.org_configs[key] ? 'bg-sky-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => onOrgConfigChange(key, !formData.org_configs[key])}
              >
                <div className="flex-1">
                  <label htmlFor={`opt-${key}`} className="text-sm font-medium cursor-pointer">
                    {config.label}
                  </label>
                  <p className="text-xs text-gray-400">{config.description}</p>
                </div>
                <Switch
                  id={`opt-${key}`}
                  checked={formData.org_configs[key]}
                  onCheckedChange={(checked) => onOrgConfigChange(key, checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
