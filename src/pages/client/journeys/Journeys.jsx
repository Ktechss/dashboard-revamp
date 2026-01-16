import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Journeys({ selectedOrganization }) {
  // Mock data
  const journeys = [
    {
      id: '1',
      journey_config_id: 'ONBOARDING_ABC123',
      journey_type: 'onboarding',
      mode: 'interactive'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">All Journeys</h1>
          <p className="text-slate-600 mt-1">{selectedOrganization?.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Journey Configurations</CardTitle>
              <Button className="bg-slate-900 hover:bg-slate-800">Create Journey</Button>
            </div>
          </CardHeader>
          <CardContent>
            {journeys.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Journey ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journeys.map((journey) => (
                    <TableRow key={journey.id}>
                      <TableCell className="font-medium">{journey.journey_config_id}</TableCell>
                      <TableCell>
                        <Badge>{journey.journey_type}</Badge>
                      </TableCell>
                      <TableCell>{journey.mode}</TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No journeys configured yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}