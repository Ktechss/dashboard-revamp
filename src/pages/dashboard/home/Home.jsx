import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Activity, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  // Mock data
  const organizations = [
    {
      id: 'gov-1',
      name: 'Dubai Police',
      type: 'government',
      email: 'contact@dubaipolice.gov.ae'
    },
    {
      id: 'pvt-1',
      name: 'Emirates NBD',
      type: 'private',
      email: 'kyc@emiratesnbd.com'
    }
  ];

  const govCount = organizations.filter(org => org.type === 'government').length;
  const privateCount = organizations.filter(org => org.type === 'private').length;

  const stats = [
    {
      title: 'Total Organizations',
      value: organizations.length,
      icon: Building2,
      color: 'bg-slate-700',
      trend: '+12.5%'
    },
    {
      title: 'Government Clients',
      value: govCount,
      icon: Users,
      color: 'bg-sky-500',
      trend: '+8.2%'
    },
    {
      title: 'Private Clients',
      value: privateCount,
      icon: Users,
      color: 'bg-slate-600',
      trend: '+15.3%'
    },
    {
      title: 'Active Journeys',
      value: '1,234',
      icon: Activity,
      color: 'bg-sky-500',
      trend: '+23.1%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome to UAE KYC Platform</p>
            </div>
            <Link to={createPageUrl('OnboardClient')}>
              <Button className="bg-slate-900 hover:bg-slate-800">
                Onboard New Client
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className={`${stat.color} bg-opacity-10 p-3 rounded-xl`}>
                      <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex items-center text-sky-600 text-sm font-medium">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {stat.trend}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-600 mt-1">{stat.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {organizations.slice(0, 5).map((org) => (
                  <div key={org.id} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${
                      org.type === 'government' ? 'bg-sky-500' : 'bg-slate-500'
                    } text-white`}>
                      {org.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{org.name}</p>
                      <p className="text-sm text-slate-500 capitalize">{org.type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      org.type === 'government'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-gray-200 text-slate-700'
                    }`}>
                      {org.type}
                    </span>
                  </div>
                ))}
                {organizations.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No organizations yet</p>
                    <Link to={createPageUrl('OnboardClient')}>
                      <Button variant="link" className="mt-2">Onboard your first client</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to={createPageUrl('GovernmentSearch')}>
                  <Button variant="outline" className="w-full justify-start">
                    Government Search
                  </Button>
                </Link>
                <Link to={createPageUrl('Analytics')}>
                  <Button variant="outline" className="w-full justify-start">
                    View Analytics
                  </Button>
                </Link>
                <Link to={createPageUrl('AuditLogs')}>
                  <Button variant="outline" className="w-full justify-start">
                    Dashboard Audit Logs
                  </Button>
                </Link>
                <Link to={createPageUrl('AllClients')}>
                  <Button variant="outline" className="w-full justify-start">
                    View All Clients
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}