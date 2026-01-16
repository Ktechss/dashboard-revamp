import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GovernmentOnboarding from './GovernmentOnboarding';
import PrivateOnboarding from './PrivateOnboarding';

export default function OnboardClient() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const handleBack = () => {
    navigate(createPageUrl('Home'));
  };

  // If no type specified, redirect to home
  if (!type || (type !== 'government' && type !== 'private')) {
    navigate(createPageUrl('Home'));
    return null;
  }

  return type === 'government' ? (
    <GovernmentOnboarding onBack={handleBack} />
  ) : (
    <PrivateOnboarding onBack={handleBack} />
  );
}