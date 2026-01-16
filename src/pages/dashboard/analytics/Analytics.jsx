import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

export default function Analytics() {
  const stats = [
    { title: 'Total Transactions', value: '45,231', icon: Activity, change: '+12.5%' },
    { title: 'Success Rate', value: '98.2%', icon: TrendingUp, change: '+2.3%' },
    { title: 'Active Users', value: '2,845', icon: Users, change: '+8.1%' },
    { title: 'Revenue', value: '$125K', icon: BarChart3, change: '+15.3%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600 mt-1">Platform performance metrics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Icon className="h-8 w-8 text-sky-600" />
                    <span className="text-sky-600 text-sm font-medium">{stat.change}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-slate-600 mt-1">{stat.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}