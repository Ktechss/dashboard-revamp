import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import UAEKYCLogo from '@/assets/logos/UAEKYC LOGO White.png';
import { ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  getSidebarConfig,
  SECTION_TYPES,
  SIDEBAR_MODES,
  mockOrganizations,
  getOnboardingSteps
} from '@/config/navigation';
import { SectionRenderer, OnboardSheet } from './components/SectionRenderers';

export default function UnifiedSidebar({
  mode,
  // Dashboard/Client mode props
  selectedOrganization,
  onSelectOrganization,
  // Onboarding mode props
  onboardingType,
  onboardingState,
  onBack
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showOnboardSheet, setShowOnboardSheet] = useState(false);

  // Get config for current mode
  const config = getSidebarConfig(mode);
  const organizations = mockOrganizations;

  // Helper to check if a page is active
  const isActive = (pageName) => {
    const currentPage = location.pathname.split('/').pop() || 'home';
    return currentPage.toLowerCase() === pageName.toLowerCase();
  };

  // Handle quick actions
  const handleAction = (action) => {
    if (action.action === 'openOnboardSheet') {
      setShowOnboardSheet(true);
    } else if (action.action === 'quickSearch') {
      // Handle quick search
    }
  };

  // Handle onboard selection
  const handleOnboardSelect = (type) => {
    setShowOnboardSheet(false);
    navigate(createPageUrl('OnboardClient') + `?type=${type}`);
  };

  // Handle back navigation
  const handleBack = () => {
    if (mode === SIDEBAR_MODES.CLIENT) {
      onSelectOrganization(null);
    } else if (onBack) {
      onBack();
    }
  };

  // Separate footer sections from main sections
  const mainSections = config.sections.filter(s => s.position !== 'footer');
  const footerSections = config.sections.filter(s => s.position === 'footer');

  // Check if onboarding mode (needs special flex layout)
  const isOnboardingMode = mode === SIDEBAR_MODES.ONBOARDING;

  return (
    <div className={`h-screen bg-slate-900 text-white flex flex-col ${config.width}`}>
      {/* Logo Header - Only shown if config says so */}
      {config.showLogo && (
        <div className="p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center">
            <img src={UAEKYCLogo} alt="UAEKYC" className="h-6 brightness-0 invert opacity-100" />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {isOnboardingMode ? (
        // Onboarding mode - special layout with flex-1 for stepper
        <div className="flex-1 flex flex-col min-h-0 pt-4">
          {mainSections.map((section, index) => (
            <SectionRenderer
              key={section.id}
              section={section}
              mode={mode}
              organization={selectedOrganization}
              organizations={organizations}
              selectedOrganization={selectedOrganization}
              onSelectOrganization={onSelectOrganization}
              onboardingType={onboardingType}
              onboardingState={onboardingState}
              onBack={handleBack}
              onAction={handleAction}
              isActive={isActive}
              getSteps={getOnboardingSteps}
            />
          ))}
        </div>
      ) : (
        // Dashboard/Client mode - scrollable sections
        <ScrollArea className="flex-1">
          {mainSections.map((section, index) => (
            <div key={section.id}>
              <SectionRenderer
                section={section}
                mode={mode}
                organization={selectedOrganization}
                organizations={organizations}
                selectedOrganization={selectedOrganization}
                onSelectOrganization={onSelectOrganization}
                onboardingType={onboardingType}
                onboardingState={onboardingState}
                onBack={handleBack}
                onAction={handleAction}
                isActive={isActive}
                getSteps={getOnboardingSteps}
              />
              {/* Add separator between sections except after last */}
              {index < mainSections.length - 1 && section.type !== SECTION_TYPES.BACK_BUTTON && (
                <Separator className="bg-slate-800" />
              )}
            </div>
          ))}
        </ScrollArea>
      )}

      {/* Footer Sections */}
      {footerSections.length > 0 && (
        <div className="shrink-0">
          {footerSections.map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              mode={mode}
              organization={selectedOrganization}
              organizations={organizations}
              selectedOrganization={selectedOrganization}
              onSelectOrganization={onSelectOrganization}
              onboardingType={onboardingType}
              onboardingState={onboardingState}
              onBack={handleBack}
              onAction={handleAction}
              isActive={isActive}
              getSteps={getOnboardingSteps}
            />
          ))}
        </div>
      )}

      {/* User Profile - Only shown if config says so */}
      {config.showUserProfile && (
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-all">
            <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-sm font-semibold">
              U
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">User Profile</p>
            </div>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Onboard Sheet - for dashboard mode */}
      <OnboardSheet
        open={showOnboardSheet}
        onOpenChange={setShowOnboardSheet}
        onSelect={handleOnboardSelect}
      />
    </div>
  );
}
