import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import UAEKYCLogo from '@/assets/logos/UAEKYC LOGO White.png';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { platformNavigation, quickActions, mockOrganizations } from '@/config/navigation';

export default function DashboardMode({
  selectedOrganization,
  onSelectOrganization
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedGov, setExpandedGov] = useState(true);
  const [expandedPrivate, setExpandedPrivate] = useState(true);
  const [showOnboardSheet, setShowOnboardSheet] = useState(false);

  const organizations = mockOrganizations;
  const govOrgs = organizations.filter(org => org.type === 'government');
  const privateOrgs = organizations.filter(org => org.type === 'private');

  const handleOnboardSelect = (type) => {
    setShowOnboardSheet(false);
    navigate(createPageUrl('OnboardClient') + `?type=${type}`);
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const isActive = (pageName) => {
    const currentPage = location.pathname.split('/').pop() || 'home';
    return currentPage.toLowerCase() === pageName.toLowerCase();
  };

  const handleQuickAction = (action) => {
    if (action.action === 'openOnboardSheet') {
      setShowOnboardSheet(true);
    } else if (action.action === 'quickSearch') {
      // Handle quick search
    }
  };

  const ClientItem = ({ org, type }) => (
    <div
      onClick={() => onSelectOrganization(org)}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all group ${
        selectedOrganization?.id === org.id
          ? type === 'government'
            ? 'bg-sky-600 border border-sky-500'
            : 'bg-slate-700 border border-slate-600'
          : 'hover:bg-slate-800'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
          type === 'government'
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
    <>
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center">
          <img src={UAEKYCLogo} alt="UAEKYC" className="h-6 brightness-0 invert opacity-100" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Platform Section */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Platform
          </h3>
          <div className="space-y-1">
            {platformNavigation.map((item) => {
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

        <Separator className="bg-slate-800" />

        {/* Quick Actions */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-1">
            {quickActions.map((action) => {
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
                  onClick={() => handleQuickAction(action)}
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

        <Separator className="bg-slate-800" />

        {/* Government Organizations */}
        <div className="p-4">
          <button
            onClick={() => setExpandedGov(!expandedGov)}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Government Orgs
            </h3>
            {expandedGov ? (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-400" />
            )}
          </button>
          {expandedGov && (
            <div className="space-y-2">
              {govOrgs.map((org) => (
                <ClientItem key={org.id} org={org} type="government" />
              ))}
            </div>
          )}
        </div>

        <Separator className="bg-slate-800" />

        {/* Private Organizations */}
        <div className="p-4">
          <button
            onClick={() => setExpandedPrivate(!expandedPrivate)}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Private Orgs
            </h3>
            {expandedPrivate ? (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-400" />
            )}
          </button>
          {expandedPrivate && (
            <div className="space-y-2">
              {privateOrgs.map((org) => (
                <ClientItem key={org.id} org={org} type="private" />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
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

      {/* Onboard Client Sheet */}
      <Sheet open={showOnboardSheet} onOpenChange={setShowOnboardSheet}>
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
              onClick={() => handleOnboardSelect('government')}
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
              onClick={() => handleOnboardSelect('private')}
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
    </>
  );
}
