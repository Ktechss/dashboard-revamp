import { createContext, useContext, useState, useCallback } from 'react';

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const [onboardingState, setOnboardingStateInternal] = useState({
    currentStep: 1,
    moduleSubStep: 0,
    formData: { enabled_journeys: [] },
    getEnabledValidationApis: () => []
  });

  const setOnboardingState = useCallback((newState) => {
    setOnboardingStateInternal(prev => ({
      ...prev,
      ...newState
    }));
  }, []);

  const resetOnboardingState = useCallback(() => {
    setOnboardingStateInternal({
      currentStep: 1,
      moduleSubStep: 0,
      formData: { enabled_journeys: [] },
      getEnabledValidationApis: () => []
    });
  }, []);

  return (
    <OnboardingContext.Provider value={{
      onboardingState,
      setOnboardingState,
      resetOnboardingState
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
