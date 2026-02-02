import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Search,
  Download
} from 'lucide-react';
import { createPageUrl } from '@/utils';

// Initial batch for fallback
const INITIAL_BATCH = {
  id: '9c955c5f-d76e-4004-80d5-69c8c497f4b3',
  fileName: 'eid_batch (2).csv',
  status: 'completed',
  progress: 100,
  totalRecords: 5,
  successCount: 3,
  failedCount: 2,
  createdAt: '12/01/2026, 13:48:50',
  records: [
    { rowNumber: 1, customer_id: 'CUST001', eid_number: '784199138421583', name_on_eid: 'AYAH N M ALBURAI', dob: '1990-05-15', eid_issue_date: '2020-01-15', eid_expiry_date: '2025-01-15' },
    { rowNumber: 2, customer_id: 'CUST002', eid_number: '784199989399409', name_on_eid: 'SACHIN DUHAN', dob: '1999-10-26', eid_issue_date: '2019-01-01', eid_expiry_date: '2027-01-01' },
    { rowNumber: 3, customer_id: 'CUST003', eid_number: '784198855404228', name_on_eid: 'AHMED HASSAN ALI', dob: '1985-03-22', eid_issue_date: '2018-06-10', eid_expiry_date: '2026-06-10' },
    { rowNumber: 4, customer_id: 'CUST004', eid_number: '784200123456789', name_on_eid: 'FATIMA KHAN', dob: '1988-01-01', eid_issue_date: '2020-01-01', eid_expiry_date: '2025-01-01' },
    { rowNumber: 5, customer_id: 'CUST005', eid_number: '784201987654321', name_on_eid: 'PRIYA SHARMA', dob: '1995-07-18', eid_issue_date: '2021-01-01', eid_expiry_date: '2026-01-01' },
  ]
};

// Helper to get batch from localStorage by ID
const getBatchById = (batchId) => {
  const stored = localStorage.getItem('batchValidations');
  if (stored) {
    const batches = JSON.parse(stored);
    const found = batches.find(b => b.id === batchId);
    if (found && found.records) {
      return found;
    }
  }
  // Return initial batch if ID matches or as fallback
  if (batchId === INITIAL_BATCH.id) {
    return INITIAL_BATCH;
  }
  return null;
};

export default function BatchValidationDetail({ selectedOrganization }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get('id');
  const [searchQuery, setSearchQuery] = useState('');
  const [batch, setBatch] = useState(null);

  // Load batch from localStorage
  useEffect(() => {
    if (batchId) {
      const foundBatch = getBatchById(batchId);
      setBatch(foundBatch);
    }
  }, [batchId]);

  if (!batch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">Batch not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate(createPageUrl('BatchValidation'))}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const filteredRecords = (batch.records || []).filter(record => {
    const matchesSearch = searchQuery === '' ||
      (record.eid_number || '').includes(searchQuery) ||
      (record.name_on_eid || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.customer_id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(createPageUrl('BatchValidation'))}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Batch Validation Details</h1>
                <p className="text-sm text-slate-500 mt-1">
                  batch-{batch.id}
                  <span className="mx-2">•</span>
                  {batch.fileName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Errors Only
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Summary
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Batch Records Table */}
        <Card>
          <CardContent className="p-6">
            {/* Search */}
            <div className="mb-4">
              <div className="relative w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by EID, name, or customer ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-16">Row #</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>EID Number</TableHead>
                    <TableHead>Name on EID</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record, index) => (
                    <TableRow key={record.rowNumber || index}>
                      <TableCell className="font-medium">{record.rowNumber}</TableCell>
                      <TableCell>{record.customer_id || '—'}</TableCell>
                      <TableCell className="font-mono">{record.eid_number || '—'}</TableCell>
                      <TableCell>{record.name_on_eid || '—'}</TableCell>
                      <TableCell>{record.dob || '—'}</TableCell>
                      <TableCell>{record.eid_issue_date || '—'}</TableCell>
                      <TableCell>{record.eid_expiry_date || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
