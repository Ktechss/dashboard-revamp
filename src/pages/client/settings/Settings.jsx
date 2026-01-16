import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Platform configuration</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Platform Name</Label>
              <Input defaultValue="UAE KYC Platform" />
            </div>
            <div>
              <Label>Support Email</Label>
              <Input defaultValue="support@uaekyc.ae" />
            </div>
            <Button className="bg-slate-900 hover:bg-slate-800">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}