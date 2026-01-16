import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function AdjudicateTasks() {
  const tasks = [
    { id: 1, name: 'John Doe', type: 'Identity Verification', status: 'pending' },
    { id: 2, name: 'Jane Smith', type: 'Document Review', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Adjudicate Tasks</h1>
          <p className="text-slate-600 mt-1">Review pending verification tasks</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{task.name}</span>
                  <span className="text-sm font-normal text-slate-600">{task.type}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button className="bg-slate-900 hover:bg-slate-800">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}