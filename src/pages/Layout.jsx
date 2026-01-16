
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/sidebar/Sidebar';

// Pages that should hide the sidebar
const FULL_SCREEN_PAGES = ['/OnboardClient'];

export default function Layout({ children }) {
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const location = useLocation();

  const isFullScreenPage = FULL_SCREEN_PAGES.some(page =>
    location.pathname.toLowerCase().startsWith(page.toLowerCase())
  );

  // For full-screen pages, render without sidebar
  if (isFullScreenPage) {
    return (
      <div className="h-screen bg-gray-50">
        {React.cloneElement(children, { selectedOrganization, setSelectedOrganization })}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        selectedOrganization={selectedOrganization}
        onSelectOrganization={setSelectedOrganization}
      />
      <main className="flex-1 overflow-auto">
        {React.cloneElement(children, { selectedOrganization, setSelectedOrganization })}
      </main>
    </div>
  );
}
