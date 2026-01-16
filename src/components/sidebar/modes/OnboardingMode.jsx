import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOnboardingSteps, ONBOARDING_TYPES } from '@/config/navigation';
import OnboardingStepper from '../components/OnboardingStepper';
import ProgressBar from '../components/ProgressBar';

export default function OnboardingMode({
  type,
  onboardingState,
  onBack
}) {
  const steps = getOnboardingSteps(type);
  const { currentStep, moduleSubStep, formData, getEnabledValidationApis } = onboardingState;
  const isPrivate = type === ONBOARDING_TYPES.PRIVATE;

  const title = type === ONBOARDING_TYPES.GOVERNMENT
    ? 'Government Organization'
    : 'Private Organization';

  return (
    <>
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 -ml-2 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className={`text-xl font-bold ${type === ONBOARDING_TYPES.GOVERNMENT ? 'text-sky-400' : 'text-white'}`}>
          {title}
        </h2>
        <p className="text-sm text-slate-400 mt-1">Complete all steps to onboard</p>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-auto p-6">
        <OnboardingStepper
          steps={steps}
          currentStep={currentStep}
          moduleSubStep={moduleSubStep}
          formData={formData}
          getEnabledValidationApis={getEnabledValidationApis}
          isPrivate={isPrivate}
        />
      </div>

      {/* Progress indicator */}
      <ProgressBar current={currentStep - 1} total={steps.length} />
    </>
  );
}
