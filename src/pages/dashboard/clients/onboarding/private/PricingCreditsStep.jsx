import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Settings, Layers } from 'lucide-react';

export default function PricingCreditsStep({ formData, errors, onChange, onPricingChange }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        {/* Initial Credits */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="px-4 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Initial Credits</h4>
              <p className="text-gray-500 text-xs">Starting credit balance</p>
            </div>
          </div>
          <div className="px-4 pb-4">
            <Input
              type="number"
              value={formData.initial_credits}
              onChange={(e) => onChange('initial_credits', parseInt(e.target.value) || 0)}
              className="text-2xl font-bold"
            />
            {errors.initial_credits && <p className="text-sm text-red-500 mt-1">{errors.initial_credits}</p>}
          </div>
        </div>

        {/* Billing Cycle */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="px-4 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Billing Cycle</h4>
              <p className="text-gray-500 text-xs">Invoice generation frequency</p>
            </div>
          </div>
          <div className="px-4 pb-4">
            <Select defaultValue="monthly">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Per-Module Pricing */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Per-Module Pricing</h4>
            <p className="text-gray-500 text-xs">Configure pricing for each enabled journey</p>
          </div>
        </div>

        <div className="px-4 pb-4 space-y-3">
          {formData.enabled_journeys.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No journeys enabled. Go back to enable journeys first.</p>
          ) : (
            formData.enabled_journeys.map((journeyType) => (
              <div key={journeyType} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm capitalize">{journeyType.replace('_', ' ')}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {formData.journey_configs[journeyType]?.journey_config_id}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Price per Transaction (AED)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.pricing[journeyType]?.price_per_transaction || 0}
                      onChange={(e) => onPricingChange(journeyType, 'price_per_transaction', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Included Transactions</Label>
                    <Input
                      type="number"
                      value={formData.pricing[journeyType]?.included_transactions || 0}
                      onChange={(e) => onPricingChange(journeyType, 'included_transactions', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
