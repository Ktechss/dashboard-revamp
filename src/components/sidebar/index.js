// Main unified sidebar component - uses config from navigation.js
export { default as UnifiedSidebar } from './UnifiedSidebar';

// Legacy mode components (kept for backward compatibility, but no longer used by UnifiedSidebar)
export { default as DashboardMode } from './modes/DashboardMode';
export { default as ClientMode } from './modes/ClientMode';
export { default as OnboardingMode } from './modes/OnboardingMode';

// Reusable components
export { default as OnboardingStepper } from './components/OnboardingStepper';
export { default as ProgressBar } from './components/ProgressBar';

// Section renderers - used internally by UnifiedSidebar
export {
  SectionRenderer,
  NavigationSection,
  ActionsSection,
  OrgListSection,
  ClientInfoSection,
  BackButtonSection,
  StepperSection,
  ProgressSection,
  OnboardSheet
} from './components/SectionRenderers';
