import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RemoteVerification({ selectedOrganization }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Remote Verification</h1>
          <p className="text-slate-600 mt-1">{selectedOrganization?.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Remote Verification Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500">No active verification sessions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}