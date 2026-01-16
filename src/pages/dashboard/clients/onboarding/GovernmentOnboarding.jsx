import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Building2, MapPin, X } from 'lucide-react';
import { toast } from 'sonner';

const STEPS = [
  { number: 1, title: 'Organization Information', icon: Building2, description: 'Basic org details' },
  { number: 2, title: 'Address & Contact', icon: MapPin, description: 'Location & contact info' }
];

export default function GovernmentOnboarding({ onBack }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+971',
    address: '',
    city: '',
    country: 'UAE',
    primary_contact_name: '',
    primary_contact_email: '',
    additional_info: ''
  });
  const [errors, setErrors] = useState({});
  const [checkingEmail, setCheckingEmail] = useState(false);
  const navigate = useNavigate();

  const createOrgMutation = useMutation({
    mutationFn: async (data) => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => resolve({ id: 'gov-new', ...data }), 1000);
      });
    },
    onSuccess: () => {
      toast.success('Government organization created successfully! Credentials sent to primary contact.');
      navigate(createPageUrl('Home'));
    },
    onError: (error) => {
      toast.error('Failed to create organization: ' + error.message);
    }
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailUniqueness = async (email, field) => {
    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, [field]: 'Please enter a valid email address' }));
      return false;
    }

    setCheckingEmail(true);
    // Simulate API check
    setTimeout(() => {
      setErrors(prev => ({ ...prev, [field]: '' }));
      setCheckingEmail(false);
    }, 500);
    return true;
  };

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\s/g, '');
    const phoneRegex = /^\+971\d{9}$/;
    return phoneRegex.test(cleanPhone);
  };

  const formatPhoneNumber = (value) => {
    let digits = value.replace(/[^\d+]/g, '');
    if (!digits.startsWith('+971')) {
      digits = '+971';
    }
    const numberPart = digits.slice(4).replace(/\D/g, '');
    const limitedNumber = numberPart.slice(0, 9);
    if (limitedNumber.length === 0) {
      return '+971';
    } else if (limitedNumber.length <= 2) {
      return `+971 ${limitedNumber}`;
    } else if (limitedNumber.length <= 5) {
      return `+971 ${limitedNumber.slice(0, 2)} ${limitedNumber.slice(2)}`;
    } else {
      return `+971 ${limitedNumber.slice(0, 2)} ${limitedNumber.slice(2, 5)} ${limitedNumber.slice(5)}`;
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handlePhoneChange = (field, value) => {
    const formatted = formatPhoneNumber(value);
    handleChange(field, formatted);
  };

  const validateStep1 = async () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Organization name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else {
      const isUnique = await checkEmailUniqueness(formData.email, 'email');
      if (!isUnique) return false;
    }

    if (!formData.phone || !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid UAE phone number (+971XXXXXXXXX)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = async () => {
    const newErrors = {};

    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.primary_contact_name) newErrors.primary_contact_name = 'Primary contact name is required';
    
    if (!formData.primary_contact_email) {
      newErrors.primary_contact_email = 'Primary contact email is required';
    } else if (!validateEmail(formData.primary_contact_email)) {
      newErrors.primary_contact_email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await validateStep1();
      if (isValid) setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateStep2();
    if (isValid) {
      createOrgMutation.mutate(formData);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Sidebar - Vertical Progress Stepper (Dark Theme) */}
      <div className="w-72 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800">
          <Button variant="ghost" onClick={handleBack} className="mb-4 -ml-2 text-slate-300 hover:text-white hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-xl font-bold text-sky-400">Government Organization</h2>
          <p className="text-sm text-slate-400 mt-1">Complete all steps to onboard</p>
        </div>

        {/* Vertical Progress Steps */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-1">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="relative">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      isActive ? 'bg-sky-600/20 border border-sky-500/50' :
                      isCompleted ? 'bg-slate-600/20' : 'hover:bg-slate-800'
                    }`}
                    onClick={() => isCompleted && setCurrentStep(step.number)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isCompleted ? 'bg-slate-600 text-white' :
                      isActive ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isActive ? 'text-sky-400' : isCompleted ? 'text-slate-400' : 'text-slate-300'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{step.description}</p>
                    </div>
                  </div>
                  {/* Vertical connector line */}
                  {index < STEPS.length - 1 && (
                    <div className={`absolute left-8 top-14 w-0.5 h-4 ${
                      currentStep > step.number ? 'bg-slate-600' : 'bg-slate-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cancel Button */}
        <div className="p-4">
          <button
            onClick={() => navigate(createPageUrl('Home'))}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-slate-400 hover:text-red-400 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-3xl mx-auto p-8">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="pt-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Organization Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter organization name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email">Organization Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => formData.email && checkEmailUniqueness(formData.email, 'email')}
                  placeholder="organization@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {checkingEmail && <p className="text-sm text-sky-500 mt-1">Checking availability...</p>}
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Organization Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange('phone', e.target.value)}
                  placeholder="+971 XX XXX XXXX"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                <p className="text-xs text-gray-500 mt-1">Format: +971 XX XXX XXXX</p>
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter address"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Enter city"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country} onValueChange={(value) => handleChange('country', value)}>
                    <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UAE">United Arab Emirates</SelectItem>
                      <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                      <SelectItem value="Qatar">Qatar</SelectItem>
                      <SelectItem value="Kuwait">Kuwait</SelectItem>
                      <SelectItem value="Bahrain">Bahrain</SelectItem>
                      <SelectItem value="Oman">Oman</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="primary_contact_name">Primary Contact Name *</Label>
                <Input
                  id="primary_contact_name"
                  value={formData.primary_contact_name}
                  onChange={(e) => handleChange('primary_contact_name', e.target.value)}
                  placeholder="Enter contact name"
                  className={errors.primary_contact_name ? 'border-red-500' : ''}
                />
                {errors.primary_contact_name && <p className="text-sm text-red-500 mt-1">{errors.primary_contact_name}</p>}
              </div>

              <div>
                <Label htmlFor="primary_contact_email">Primary Contact Email *</Label>
                <Input
                  id="primary_contact_email"
                  type="email"
                  value={formData.primary_contact_email}
                  onChange={(e) => handleChange('primary_contact_email', e.target.value)}
                  placeholder="contact@example.com"
                  className={errors.primary_contact_email ? 'border-red-500' : ''}
                />
                {errors.primary_contact_email && <p className="text-sm text-red-500 mt-1">{errors.primary_contact_email}</p>}
              </div>

              <div>
                <Label htmlFor="additional_info">Additional Information (Optional)</Label>
                <Textarea
                  id="additional_info"
                  value={formData.additional_info}
                  onChange={(e) => handleChange('additional_info', e.target.value)}
                  placeholder="Any additional notes or information..."
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">Provide any relevant details about the organization</p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} className="bg-slate-900 hover:bg-slate-800">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createOrgMutation.isPending}
                className="bg-slate-900 hover:bg-slate-800"
              >
                {createOrgMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Complete Onboarding
                  </>
                )}
              </Button>
            )}
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}