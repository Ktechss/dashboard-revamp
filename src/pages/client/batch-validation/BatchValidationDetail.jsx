import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ArrowLeft,
  Download,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  FileText,
  Filter,
  AlertCircle
} from 'lucide-react';
import { createPageUrl } from '@/utils';

// Mock batch detail data
const MOCK_BATCH = {
  id: '9c955c5f-d76e-4004-80d5-69c8c497f4b3',
  fileName: 'eid_batch (2).csv',
  status: 'completed',
  progress: 100,
  totalRecords: 5,
  successCount: 1,
  failedCount: 4,
  successRate: 20,
  createdAt: '12/01/2026, 13:48:50',
  records: [
    {
      rowNumber: 1,
      emiratesId: '784199138421583',
      fullName: 'AYAH N M ALBURAI',
      dateOfBirth: '1990-05-15',
      nationality: 'PSE',
      status: 'valid',
      transactionId: 'txn-001',
      validationErrors: []
    },
    {
      rowNumber: 2,
      emiratesId: '784198855404228',
      fullName: 'Ankit Gupta',
      dateOfBirth: '1985-12-03',
      nationality: 'IND',
      status: 'valid',
      transactionId: 'txn-002',
      validationErrors: []
    },
    {
      rowNumber: 3,
      emiratesId: '784199989399409',
      fullName: 'Sachin Duhan',
      dateOfBirth: '1999-10-26',
      nationality: 'IND',
      status: 'valid',
      transactionId: 'txn-003',
      validationErrors: []
    },
    {
      rowNumber: 4,
      emiratesId: '784200123456789',
      fullName: 'Ahmed Hassan',
      dateOfBirth: '1988-03-22',
      nationality: 'PAK',
      status: 'invalid',
      transactionId: null,
      validationErrors: ['EID not found in database', 'Card number mismatch']
    },
    {
      rowNumber: 5,
      emiratesId: '784201987654321',
      fullName: 'Priya Sharma',
      dateOfBirth: '1995-07-18',
      nationality: 'IND',
      status: 'invalid',
      transactionId: null,
      validationErrors: ['Visa expired']
    }
  ]
};

export default function BatchValidationDetail({ selectedOrganization }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get('id') || MOCK_BATCH.id;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // In real app, fetch batch by ID
  const batch = MOCK_BATCH;

  const filteredRecords = batch.records.filter(record => {
    const matchesSearch =
      record.emiratesId.includes(searchQuery) ||
      record.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
            Completed
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100 border-0">
            Processing
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRecordStatusBadge = (status, errors = []) => {
    if (status === 'valid') {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Valid
        </Badge>
      );
    }

    // For invalid records with errors, show popover
    if (errors.length > 0) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <button className="cursor-pointer">
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
                <XCircle className="h-3 w-3 mr-1" />
                Invalid
              </Badge>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-600 font-medium">
                <AlertCircle className="h-4 w-4" />
                Validation Errors
              </div>
              <ul className="text-sm space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx} className="text-slate-600 flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
        <XCircle className="h-3 w-3 mr-1" />
        Invalid
      </Badge>
    );
  };

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
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <div className="mt-2">{getStatusBadge(batch.status)}</div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Progress</p>
                  <p className="text-2xl font-bold mt-1">{batch.progress}%</p>
                  <p className="text-xs text-slate-400">{batch.successCount + batch.failedCount} / {batch.totalRecords} records</p>
                </div>
                <FileText className="h-5 w-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Success Rate</p>
                  <p className="text-2xl font-bold mt-1">{batch.successRate}%</p>
                  <p className="text-xs text-slate-400">{batch.successCount} successful</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Errors</p>
                  <p className="text-2xl font-bold mt-1 text-red-600">{batch.failedCount}</p>
                  <p className="text-xs text-slate-400">failed records</p>
                </div>
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Batch Records Table */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Batch Records</h2>
              <p className="text-sm text-slate-500">Individual validation transaction records from the uploaded CSV file</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by reference ID, Emirates ID, or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Records" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Records</SelectItem>
                    <SelectItem value="valid">Valid Only</SelectItem>
                    <SelectItem value="invalid">Invalid Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-16">Row #</TableHead>
                    <TableHead>Emirates ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.rowNumber}>
                      <TableCell className="font-medium">{record.rowNumber}</TableCell>
                      <TableCell className="font-mono">{record.emiratesId}</TableCell>
                      <TableCell>{record.fullName}</TableCell>
                      <TableCell>{record.dateOfBirth}</TableCell>
                      <TableCell>{record.nationality}</TableCell>
                      <TableCell>
                        {getRecordStatusBadge(record.status, record.validationErrors)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={record.status !== 'valid'}
                          onClick={() => {
                            if (record.transactionId) {
                              navigate(createPageUrl('ValidationDetail') + `?id=${record.transactionId}`);
                            }
                          }}
                        >
                          <ExternalLink className={`h-4 w-4 ${record.status !== 'valid' ? 'text-slate-300' : 'text-sky-600'}`} />
                        </Button>
                      </TableCell>
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
