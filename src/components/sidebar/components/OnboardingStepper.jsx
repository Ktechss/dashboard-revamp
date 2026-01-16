import { CheckCircle2 } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/pages/dashboard/clients/onboarding/private/constants';

export default function OnboardingStepper({
  steps,
  currentStep,
  moduleSubStep = 0,
  formData = { enabled_journeys: [] },
  getEnabledValidationApis = () => [],
  isPrivate = false,
  onStepClick
}) {
  const getServiceSubSteps = () => {
    if (!isPrivate) return [];

    const subSteps = [];

    // Check if any KYC Service journeys are enabled
    const kycJourneys = formData.enabled_journeys?.filter(j =>
      SERVICE_CATEGORIES.kyc_service.services.some(s => s.id === j)
    ) || [];
    if (kycJourneys.length > 0) {
      subSteps.push({
        id: 'kyc_service',
        label: SERVICE_CATEGORIES.kyc_service.label,
        type: 'service',
        journeys: kycJourneys
      });
    }

    // Check if any Authentication Service journeys are enabled
    const authJourneys = formData.enabled_journeys?.filter(j =>
      SERVICE_CATEGORIES.authentication_service.services.some(s => s.id === j)
    ) || [];
    if (authJourneys.length > 0) {
      subSteps.push({
        id: 'authentication_service',
        label: SERVICE_CATEGORIES.authentication_service.label,
        type: 'service',
        journeys: authJourneys
      });
    }

    // Check if any Validation Service APIs are enabled
    const validationApis = getEnabledValidationApis();
    if (validationApis.length > 0) {
      subSteps.push({
        id: 'validation_service',
        label: SERVICE_CATEGORIES.validation_service.label,
        type: 'validation',
        services: validationApis
      });
    }

    return subSteps;
  };

  return (
    <div className="space-y-2">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        const subSteps = step.number === 2 && isPrivate ? getServiceSubSteps() : [];

        return (
          <div key={step.number} className="relative">
            <div
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                onStepClick && isCompleted ? 'cursor-pointer' : ''
              } ${
                isActive && moduleSubStep === 0 ? 'bg-sky-600/20 border border-gray-400/50' :
                isActive ? 'bg-slate-700/50' :
                isCompleted ? 'bg-slate-600/20' : ''
              }`}
              onClick={() => onStepClick && isCompleted && onStepClick(step.number)}
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

            {/* Connector from Module Configuration icon down to sub-steps */}
            {step.number === 2 && currentStep === 2 && subSteps.length > 0 && isPrivate && (
              <div className="absolute left-[31px] top-14 w-0.5 h-2 bg-slate-700" />
            )}

            {/* Sub-steps for Module Configuration */}
            {step.number === 2 && currentStep === 2 && subSteps.length > 0 && isPrivate && (
              <div className="relative ml-[31px] mt-1 space-y-1 pl-5">
                <div className="absolute left-0 top-0 -bottom-1 w-0.5 bg-slate-700" />
                {subSteps.map((subStep, subIndex) => {
                  let startIndex = 1;
                  for (let i = 0; i < subIndex; i++) {
                    const prevStep = subSteps[i];
                    startIndex += prevStep.journeys?.length || prevStep.services?.length || 0;
                  }
                  const count = subStep.journeys?.length || subStep.services?.length || 0;
                  const endIndex = startIndex + count - 1;
                  const isSubActive = moduleSubStep >= startIndex && moduleSubStep <= endIndex;
                  const isSubCompleted = moduleSubStep > endIndex;

                  return (
                    <div
                      key={subStep.id}
                      className={`relative flex items-center gap-2 p-2 rounded transition-all ${
                        isSubActive ? 'bg-sky-600/20' :
                        isSubCompleted ? 'bg-slate-700/30' : ''
                      }`}
                    >
                      <div className="absolute left-[-20px] top-1/2 w-3 h-0.5 bg-slate-700" />
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                        isSubCompleted ? 'bg-slate-600 text-white' :
                        isSubActive ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {isSubCompleted ? <CheckCircle2 className="h-3 w-3" /> : subIndex + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs truncate ${
                          isSubActive ? 'text-sky-400 font-medium' :
                          isSubCompleted ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {subStep.label}
                        </p>
                        {isSubActive && count > 1 && (
                          <p className="text-[10px] text-slate-500">
                            {moduleSubStep - startIndex + 1} of {count}
                          </p>
                        )}
                      </div>
                      {subStep.type === 'validation' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">API</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Vertical connector line between main steps */}
            {index < steps.length - 1 && !(step.number === 2 && currentStep === 2 && subSteps.length > 0 && isPrivate) && (
              <div className={`absolute left-[31px] top-14 w-0.5 h-4 ${
                currentStep > step.number ? 'bg-slate-600' : 'bg-slate-700'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
