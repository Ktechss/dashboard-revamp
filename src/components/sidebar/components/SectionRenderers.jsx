import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Edit,
  Eye,
  Archive,
  Landmark,
  Building2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { SECTION_TYPES, ONBOARDING_TYPES } from '@/config/navigation';
import OnboardingStepper from './OnboardingStepper';
import ProgressBar from './ProgressBar';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
const getInitials = (name) => {
  if (!name) return '??';
  const words = name.trim().split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// =============================================================================
// NAVIGATION SECTION - Renders navigation links
// =============================================================================
export function NavigationSection({ section, organization, isActive }) {
  const items = section.getItems ? section.getItems(organization) : section.items;

  return (
    <div className="p-4">
      {section.title && (
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {section.title}
        </h3>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.page);
          return (
            <Link
              key={item.id}
              to={createPageUrl(item.page)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                active
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// ACTIONS SECTION - Renders action buttons
// =============================================================================
export function ActionsSection({ section, onAction }) {
  return (
    <div className="p-4">
      {section.title && (
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {section.title}
        </h3>
      )}
      <div className="space-y-1">
        {section.items.map((action) => {
          const Icon = action.icon;
          if (action.type === 'link') {
            return (
              <Link
                key={action.id}
                to={createPageUrl(action.page)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            );
          }
          return (
            <button
              key={action.id}
              onClick={() => onAction(action)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                action.type === 'primary'
                  ? 'bg-sky-600 hover:bg-sky-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// ORG LIST SECTION - Renders collapsible organization list
// =============================================================================
export function OrgListSection({
  section,
  organizations,
  selectedOrganization,
  onSelectOrganization
}) {
  const [expanded, setExpanded] = useState(section.defaultExpanded ?? true);
  const filteredOrgs = organizations.filter(org => org.type === section.orgType);

  const ClientItem = ({ org }) => (
    <div
      onClick={() => onSelectOrganization(org)}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all group ${
        selectedOrganization?.id === org.id
          ? section.orgType === 'government'
            ? 'bg-sky-600 border border-sky-500'
            : 'bg-slate-700 border border-slate-600'
          : 'hover:bg-slate-800'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
          section.orgType === 'government'
            ? 'bg-sky-500 text-white'
            : 'bg-slate-500 text-white'
        }`}
      >
        {getInitials(org.name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{org.name}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-white hover:bg-slate-600">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onSelectOrganization(org);
          }}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
            <Edit className="h-4 w-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-red-600">
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="p-4">
      {section.collapsible ? (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between mb-3"
        >
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {section.title}
          </h3>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
        </button>
      ) : (
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {section.title}
        </h3>
      )}
      {expanded && (
        <div className="space-y-2">
          {filteredOrgs.map((org) => (
            <ClientItem key={org.id} org={org} />
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// CLIENT INFO SECTION - Renders selected client header
// =============================================================================
export function ClientInfoSection({ organization }) {
  return (
    <div className="p-4 bg-slate-800">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${
            organization.type === 'government'
              ? 'bg-sky-500'
              : 'bg-slate-500'
          }`}
        >
          {getInitials(organization.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{organization.name}</p>
          <p className="text-xs text-slate-400 capitalize">{organization.type}</p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// BACK BUTTON SECTION - Renders back navigation
// =============================================================================
export function BackButtonSection({ section, onBack }) {
  const Icon = section.icon;
  return (
    <div className="px-4 pt-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
      >
        <Icon className="h-4 w-4 mr-2" />
        {section.label}
      </Button>
    </div>
  );
}

// =============================================================================
// STEPPER SECTION - Renders onboarding stepper
// =============================================================================
export function StepperSection({ section, onboardingType, onboardingState }) {
  const steps = section.getSteps(onboardingType);
  const { currentStep, moduleSubStep, formData, getEnabledValidationApis } = onboardingState || {};
  const isPrivate = onboardingType === ONBOARDING_TYPES.PRIVATE;

  const title = onboardingType === ONBOARDING_TYPES.GOVERNMENT
    ? 'Government Organization'
    : 'Private Organization';

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="px-6 pb-4">
        <h2 className={`text-xl font-bold ${onboardingType === ONBOARDING_TYPES.GOVERNMENT ? 'text-sky-400' : 'text-white'}`}>
          {title}
        </h2>
        <p className="text-sm text-slate-400 mt-1">Complete all steps to onboard</p>
      </div>

      {/* Steps - scrollable */}
      <div className="flex-1 overflow-auto px-6">
        <OnboardingStepper
          steps={steps}
          currentStep={currentStep}
          moduleSubStep={moduleSubStep}
          formData={formData}
          getEnabledValidationApis={getEnabledValidationApis}
          isPrivate={isPrivate}
        />
      </div>
    </div>
  );
}

// =============================================================================
// PROGRESS SECTION - Renders progress bar
// =============================================================================
export function ProgressSection({ onboardingType, onboardingState, getSteps }) {
  const steps = getSteps(onboardingType);
  const { currentStep } = onboardingState || {};
  return <ProgressBar current={currentStep - 1} total={steps.length} />;
}

// =============================================================================
// ONBOARD SHEET - Onboard client selection sheet
// =============================================================================
export function OnboardSheet({ open, onOpenChange, onSelect }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[450px]">
        <SheetHeader>
          <SheetTitle className="text-2xl">Onboard New Client</SheetTitle>
          <SheetDescription>
            Select the organization type to begin the onboarding process
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {/* Government Option */}
          <div
            onClick={() => onSelect('government')}
            className="p-6 border-2 rounded-xl cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                <Landmark className="h-6 w-6 text-sky-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Government Organization</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Simplified 2-step onboarding for government entities
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded">Quick Setup</span>
                  <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded">Auto Credentials</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-sky-600 transition-colors" />
            </div>
          </div>

          {/* Private Option */}
          <div
            onClick={() => onSelect('private')}
            className="p-6 border-2 rounded-xl cursor-pointer hover:border-slate-400 hover:bg-gray-50 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                <Building2 className="h-6 w-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Private Organization</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Comprehensive 6-step onboarding with full configuration
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs bg-gray-200 text-slate-700 px-2 py-1 rounded">Module Config</span>
                  <span className="text-xs bg-gray-200 text-slate-700 px-2 py-1 rounded">Custom Pricing</span>
                  <span className="text-xs bg-gray-200 text-slate-700 px-2 py-1 rounded">API Keys</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// =============================================================================
// SECTION RENDERER - Main renderer that picks the right component
// =============================================================================
export function SectionRenderer({
  section,
  mode,
  organization,
  organizations,
  selectedOrganization,
  onSelectOrganization,
  onboardingType,
  onboardingState,
  onBack,
  onAction,
  isActive,
  getSteps
}) {
  switch (section.type) {
    case SECTION_TYPES.NAVIGATION:
      return (
        <NavigationSection
          section={section}
          organization={organization}
          isActive={isActive}
        />
      );

    case SECTION_TYPES.ACTIONS:
      return (
        <ActionsSection
          section={section}
          onAction={onAction}
        />
      );

    case SECTION_TYPES.ORG_LIST:
      return (
        <OrgListSection
          section={section}
          organizations={organizations}
          selectedOrganization={selectedOrganization}
          onSelectOrganization={onSelectOrganization}
        />
      );

    case SECTION_TYPES.CLIENT_INFO:
      return organization ? (
        <ClientInfoSection organization={organization} />
      ) : null;

    case SECTION_TYPES.BACK_BUTTON:
      return (
        <BackButtonSection
          section={section}
          onBack={onBack}
        />
      );

    case SECTION_TYPES.STEPPER:
      return (
        <StepperSection
          section={section}
          onboardingType={onboardingType}
          onboardingState={onboardingState}
        />
      );

    case SECTION_TYPES.PROGRESS:
      return (
        <ProgressSection
          onboardingType={onboardingType}
          onboardingState={onboardingState}
          getSteps={getSteps}
        />
      );

    default:
      return null;
  }
}
