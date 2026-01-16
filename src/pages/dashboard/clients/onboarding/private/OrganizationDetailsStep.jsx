import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, UserCheck } from 'lucide-react';

const ORGANIZATION_CATEGORIES = [
  'Financial', 'Healthcare', 'Education', 'Retail',
  'Technology', 'Hospitality', 'Government', 'Other'
];

const COUNTRIES = [
  { value: 'UAE', label: 'United Arab Emirates' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'Bahrain', label: 'Bahrain' },
  { value: 'Oman', label: 'Oman' }
];

export default function OrganizationDetailsStep({ formData, errors, onChange, onPhoneChange }) {
  return (
    <div className="space-y-5">
      {/* Organization Information Section */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Organization Information</h4>
            <p className="text-gray-500 text-xs">Basic company details</p>
          </div>
        </div>
        <div className="px-4 pb-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Organization Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="Enter organization name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label className="text-sm">Organization Category *</Label>
              <Select value={formData.organization_category} onValueChange={(v) => onChange('organization_category', v)}>
                <SelectTrigger className={errors.organization_category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {ORGANIZATION_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.organization_category && <p className="text-sm text-red-500 mt-1">{errors.organization_category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Registration Number</Label>
              <Input
                value={formData.registration_number}
                onChange={(e) => onChange('registration_number', e.target.value)}
                placeholder="Trade license / CR number"
              />
            </div>
            <div>
              <Label className="text-sm">Organization Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="organization@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Organization Phone *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => onPhoneChange('phone', e.target.value)}
                placeholder="+971 XX XXX XXXX"
                className={errors.phone ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500 mt-1">Format: +971 XX XXX XXXX</p>
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <Label className="text-sm">Address *</Label>
              <Input
                value={formData.address}
                onChange={(e) => onChange('address', e.target.value)}
                placeholder="Street address"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">City *</Label>
              <Input
                value={formData.city}
                onChange={(e) => onChange('city', e.target.value)}
                placeholder="City"
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label className="text-sm">Country *</Label>
              <Select value={formData.country} onValueChange={(v) => onChange('country', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(country => (
                    <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Root User Section */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Root User / Admin</h4>
              <p className="text-gray-500 text-xs">Primary contact and admin credentials</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
              formData.root_user_same_as_contact ? 'bg-sky-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => onChange('root_user_same_as_contact', !formData.root_user_same_as_contact)}
          >
            <Checkbox
              id="root_user_same"
              checked={formData.root_user_same_as_contact}
              onCheckedChange={(checked) => onChange('root_user_same_as_contact', checked)}
            />
            <label htmlFor="root_user_same" className="text-sm cursor-pointer text-slate-600">
              Root user will be the primary contact
            </label>
          </div>
        </div>
        <div className="px-4 pb-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Contact Name *</Label>
              <Input
                value={formData.primary_contact_name}
                onChange={(e) => onChange('primary_contact_name', e.target.value)}
                placeholder="Full name"
                className={errors.primary_contact_name ? 'border-red-500' : ''}
              />
              {errors.primary_contact_name && <p className="text-sm text-red-500 mt-1">{errors.primary_contact_name}</p>}
            </div>
            <div>
              <Label className="text-sm">Contact Email *</Label>
              <Input
                type="email"
                value={formData.primary_contact_email}
                onChange={(e) => onChange('primary_contact_email', e.target.value)}
                placeholder="contact@example.com"
                className={errors.primary_contact_email ? 'border-red-500' : ''}
              />
              {errors.primary_contact_email && <p className="text-sm text-red-500 mt-1">{errors.primary_contact_email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Contact Phone *</Label>
              <Input
                value={formData.primary_contact_phone}
                onChange={(e) => onPhoneChange('primary_contact_phone', e.target.value)}
                placeholder="+971 XX XXX XXXX"
                className={errors.primary_contact_phone ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500 mt-1">Format: +971 XX XXX XXXX</p>
              {errors.primary_contact_phone && <p className="text-sm text-red-500 mt-1">{errors.primary_contact_phone}</p>}
            </div>
            <div>
              <Label className="text-sm">Root User Password *</Label>
              <Input
                type="password"
                value={formData.root_password}
                onChange={(e) => onChange('root_password', e.target.value)}
                placeholder="Create password"
                className={errors.root_password ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500 mt-1">Min 8 chars, uppercase, lowercase, number, special char</p>
              {errors.root_password && <p className="text-sm text-red-500 mt-1">{errors.root_password}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
