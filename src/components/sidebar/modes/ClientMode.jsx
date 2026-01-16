import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import UAEKYCLogo from '@/assets/logos/UAEKYC LOGO White.png';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getClientNavigation } from '@/config/navigation';

export default function ClientMode({
  organization,
  onBack
}) {
  const location = useLocation();
  const clientNav = getClientNavigation(organization);

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

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <img src={UAEKYCLogo} alt="UAEKYC" className="h-6 brightness-0 invert opacity-80" />
        </div>

        {/* Back to Platform */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Platform
        </Button>
      </div>

      {/* Selected Organization Info */}
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

      {/* Client Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {clientNav.map((item) => {
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
      </ScrollArea>
    </>
  );
}
