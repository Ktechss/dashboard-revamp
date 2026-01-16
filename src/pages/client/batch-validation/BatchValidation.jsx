import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
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
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  Search,
  Eye,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Filter,
  Calendar
} from 'lucide-react';

// Mock batch data
const MOCK_BATCHES = [
  {
    id: '9c955c5f-d76e-4004-80d5-69c8c497f4b3',
    fileName: 'eid_batch (2).csv',
    status: 'completed',
    progress: 100,
    totalRecords: 5,
    successCount: 1,
    failedCount: 4,
    createdAt: '12/01/2026, 13:48:50',
  },
  {
    id: 'eca7849b-cc0b-4e34-88a9-99d2530df50f',
    fileName: 'eid_new.csv',
    status: 'completed',
    progress: 100,
    totalRecords: 1,
    successCount: 1,
    failedCount: 0,
    createdAt: '08/01/2026, 18:03:51',
  },
  {
    id: '76c0c1b7-0f56-4f60-8118-88a52786974d',
    fileName: 'eid_new.csv',
    status: 'completed',
    progress: 100,
    totalRecords: 1,
    successCount: 1,
    failedCount: 0,
    createdAt: '08/01/2026, 17:44:43',
  },
  {
    id: 'abc123-processing',
    fileName: 'passport_batch.csv',
    status: 'processing',
    progress: 65,
    totalRecords: 100,
    successCount: 45,
    failedCount: 20,
    createdAt: '15/01/2026, 10:30:00',
  }
];

// Limits configuration
const BATCH_LIMITS = {
  maxBatches: 10,
  maxRecordsPerBatch: 1000,
  totalRecordsAllowed: 50000,
  usedBatches: 4,
  usedRecords: 107
};

export default function BatchValidation({ selectedOrganization }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [batches] = useState(MOCK_BATCHES);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">
            <Clock className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: batches.length,
    processing: batches.filter(b => b.status === 'processing').length,
    completed: batches.filter(b => b.status === 'completed').length,
    failed: batches.filter(b => b.status === 'failed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Batch Validation</h1>
              <p className="text-slate-500 mt-1">Manage and monitor your CSV batch validation jobs</p>
            </div>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Limits Alert */}
        <Card className="mb-6 border-sky-200 bg-sky-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-sky-600" />
                  <span className="font-medium text-sky-900">Usage Limits</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-sky-700">Batches: </span>
                    <span className="font-semibold text-sky-900">
                      {BATCH_LIMITS.usedBatches} / {BATCH_LIMITS.maxBatches}
                    </span>
                  </div>
                  <div>
                    <span className="text-sky-700">Records Used: </span>
                    <span className="font-semibold text-sky-900">
                      {BATCH_LIMITS.usedRecords.toLocaleString()} / {BATCH_LIMITS.totalRecordsAllowed.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sky-700">Max per Batch: </span>
                    <span className="font-semibold text-sky-900">
                      {BATCH_LIMITS.maxRecordsPerBatch.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Batches</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <Upload className="h-5 w-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Processing</p>
                  <p className="text-2xl font-bold mt-1">{stats.processing}</p>
                </div>
                <Clock className="h-5 w-5 text-sky-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Completed</p>
                  <p className="text-2xl font-bold mt-1">{stats.completed}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Failed</p>
                  <p className="text-2xl font-bold mt-1">{stats.failed}</p>
                </div>
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Batch Jobs Table */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Batch Jobs</h2>
                <p className="text-sm text-slate-500">View and manage your batch validation transaction jobs</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by filename or batch ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>File Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="font-medium">{batch.fileName}</p>
                            <p className="text-xs text-slate-400 font-mono">{batch.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(batch.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Progress value={batch.progress} className="h-2 flex-1" />
                          <span className="text-xs text-slate-500">{batch.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{batch.totalRecords}</TableCell>
                      <TableCell>
                        <span className="text-green-600">{batch.successCount}</span>
                        <span className="text-slate-400"> / </span>
                        <span className="text-red-600">{batch.failedCount}</span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{batch.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigate(createPageUrl('BatchValidationDetail') + `?id=${batch.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
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
