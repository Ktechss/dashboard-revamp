import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { STEPS } from './constants';

export default function StepLayout({
  currentStep,
  title,
  description,
  orgName,
  showOrgName = true,
  children,
  onBack,
  onNext,
  isLastStep = false,
  isSubmitting = false,
  submitDisabled = false,
  rightContent = null
}) {
  const stepInfo = STEPS.find(s => s.number === currentStep);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {title || stepInfo?.title}
            </h2>
            <p className="text-gray-500 mt-1">
              {description || stepInfo?.description}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {rightContent}
            {showOrgName && currentStep !== 1 && orgName && (
              <div className="text-right">
                <p className="text-lg font-semibold text-slate-900">{orgName}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white px-8 py-4">
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {!isLastStep ? (
            <Button onClick={onNext} className="bg-slate-900 hover:bg-slate-800">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={isSubmitting || submitDisabled}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
