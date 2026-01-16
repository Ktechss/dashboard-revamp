import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AuditLogs() {
  const logs = [
    { id: 1, action: 'Organization Created', user: 'admin@uaekyc.ae', timestamp: '2026-01-14 10:30:00', status: 'success' },
    { id: 2, action: 'Journey Started', user: 'user@company.com', timestamp: '2026-01-14 10:25:00', status: 'success' },
    { id: 3, action: 'Login Failed', user: 'unknown@test.com', timestamp: '2026-01-14 10:20:00', status: 'error' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Audit Logs</h1>
          <p className="text-slate-600 mt-1">Track all platform activities</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}