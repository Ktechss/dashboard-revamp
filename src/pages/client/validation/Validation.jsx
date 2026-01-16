import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  Search,
  Eye,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  Copy
} from 'lucide-react';

// Mock EID transaction data
const MOCK_EID_TRANSACTIONS = [
  {
    id: 'a04ebb0f-1234-5678-9abc-def012345678',
    emiratesId: '784199138421583',
    documentNumber: 'I1234567',
    name: null,
    status: 'error',
    source: 'API',
    createdAt: 'Jan 12, 2026 13:49',
    validationErrors: ['EID not found in ICP database', 'Card number mismatch']
  },
  {
    id: '66dccfd8-2345-6789-abcd-ef0123456789',
    emiratesId: '784201987654321',
    documentNumber: 'I2345678',
    name: null,
    status: 'error',
    source: 'Batch',
    createdAt: 'Jan 12, 2026 13:49',
    validationErrors: ['Visa expired', 'Record flagged for review']
  },
  {
    id: '73a6bdc0-3456-789a-bcde-f01234567890',
    emiratesId: '784200123456789',
    documentNumber: 'I3456789',
    name: null,
    status: 'error',
    source: 'API',
    createdAt: 'Jan 12, 2026 13:49',
    validationErrors: ['DOB mismatch']
  },
  {
    id: 'ab645741-4567-89ab-cdef-012345678901',
    emiratesId: '784198855404228',
    documentNumber: 'I4567890',
    name: null,
    status: 'failed',
    source: 'Batch',
    createdAt: 'Jan 12, 2026 13:48',
    validationErrors: ['System timeout', 'Retry required']
  },
  {
    id: '7c72b5fc-5678-9abc-def0-123456789012',
    emiratesId: '784199989399409',
    documentNumber: 'I5678901',
    name: 'Ahmed Mohammed Al Rashid',
    status: 'success',
    source: 'API',
    createdAt: 'Jan 12, 2026 13:48',
    validationErrors: []
  },
  {
    id: 'b68ab45d-6789-abcd-ef01-234567890123',
    emiratesId: '784199989399409',
    documentNumber: 'I6789012',
    name: 'Fatima Hassan Ali',
    status: 'success',
    source: 'API',
    createdAt: 'Jan 8, 2026 19:59',
    validationErrors: []
  },
  {
    id: '624f1802-789a-bcde-f012-345678901234',
    emiratesId: '784199989399409',
    documentNumber: 'I7890123',
    name: 'Omar Khalid Ibrahim',
    status: 'success',
    source: 'Batch',
    createdAt: 'Jan 8, 2026 18:03',
    validationErrors: []
  },
  {
    id: '9ee5b5f9-89ab-cdef-0123-456789012345',
    emiratesId: '784199989399409',
    documentNumber: 'I8901234',
    name: 'Sara Ahmed Khan',
    status: 'success',
    source: 'API',
    createdAt: 'Jan 8, 2026 17:44',
    validationErrors: []
  }
];

// Mock Passport transaction data
const MOCK_PASSPORT_TRANSACTIONS = [
  {
    id: 'pp-001-abcd-efgh',
    passportNumber: 'AB1234567',
    documentNumber: 'AB1234567',
    name: 'John Smith Williams',
    status: 'success',
    source: 'API',
    createdAt: 'Jan 14, 2026 10:30',
    nationality: 'United Kingdom',
    validationErrors: []
  },
  {
    id: 'pp-002-ijkl-mnop',
    passportNumber: 'CD9876543',
    documentNumber: 'CD9876543',
    name: null,
    status: 'error',
    source: 'Batch',
    createdAt: 'Jan 14, 2026 09:15',
    nationality: 'India',
    validationErrors: ['Passport expired', 'Record not found in database']
  },
  {
    id: 'pp-003-qrst-uvwx',
    passportNumber: 'EF5432167',
    documentNumber: 'EF5432167',
    name: 'Maria Garcia Lopez',
    status: 'success',
    source: 'API',
    createdAt: 'Jan 13, 2026 16:45',
    nationality: 'Spain',
    validationErrors: []
  },
  {
    id: 'pp-004-yzab-cdef',
    passportNumber: 'GH1122334',
    documentNumber: 'GH1122334',
    name: null,
    status: 'failed',
    source: 'API',
    createdAt: 'Jan 13, 2026 14:20',
    nationality: 'Germany',
    validationErrors: ['System error during validation']
  }
];

export default function Validation({ selectedOrganization }) {
  const navigate = useNavigate();

  // Check which validation APIs are enabled for the organization
  const hasEidValidation = selectedOrganization?.validation_config?.eid_validation?.enabled ?? true;
  const hasPassportValidation = selectedOrganization?.validation_config?.passport_validation?.enabled ?? true;

  // Default to the first enabled tab
  const defaultTab = hasEidValidation ? 'eid' : (hasPassportValidation ? 'passport' : 'eid');

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [distinctOnly, setDistinctOnly] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  const transactions = activeTab === 'eid' ? MOCK_EID_TRANSACTIONS : MOCK_PASSPORT_TRANSACTIONS;
  const idField = activeTab === 'eid' ? 'emiratesId' : 'passportNumber';
  const idLabel = activeTab === 'eid' ? 'Emirates ID' : 'Passport Number';

  // Filter transactions
  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn[idField].includes(searchQuery) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.name && txn.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || txn.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Get distinct count
  const distinctIds = new Set(filteredTransactions.map(t => t[idField]));
  const distinctCount = distinctIds.size;

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + rowsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
            SUCCESS
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
            ERROR
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
            FAILED
          </Badge>
        );
      default:
        return <Badge variant="outline">{status.toUpperCase()}</Badge>;
    }
  };

  const getSourceBadge = (source) => {
    return source === 'Batch' ? (
      <Badge variant="outline" className="text-xs">Batch</Badge>
    ) : (
      <Badge variant="outline" className="text-xs bg-sky-50 text-sky-700 border-sky-200">API</Badge>
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Validation Transactions</h1>
          <p className="text-slate-500 mt-1">Browse and manage all validation transactions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Tabs - only show if both APIs are enabled, otherwise show heading */}
        {hasEidValidation && hasPassportValidation ? (
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('eid')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'eid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EID
            </button>
            <button
              onClick={() => setActiveTab('passport')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'passport'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Passport
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-4 py-2 rounded-lg">
              {hasEidValidation ? 'EID Validation' : 'Passport Validation'}
            </span>
          </div>
        )}

        <Card>
          <CardContent className="p-6">
            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1 min-w-[250px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={`Search by ${idLabel}, ID, or name...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="w-[140px]"
                  placeholder="From"
                />
                <span className="text-slate-400">to</span>
                <Input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="w-[140px]"
                  placeholder="To"
                />
              </div>

              {/* Distinct Only Toggle */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="distinctOnly"
                  checked={distinctOnly}
                  onCheckedChange={setDistinctOnly}
                />
                <label htmlFor="distinctOnly" className="text-sm text-slate-600 cursor-pointer">
                  Distinct Individuals
                </label>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Source Filter */}
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                  <SelectItem value="Batch">Batch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>{idLabel}</TableHead>
                    <TableHead>Document Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((txn) => {
                    const hasErrors = txn.validationErrors && txn.validationErrors.length > 0;
                    const isClickable = txn.status === 'success';

                    return (
                      <TableRow key={txn.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{txn[idField]}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(txn[idField])}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-slate-600">
                          {txn.documentNumber}
                        </TableCell>
                        <TableCell>
                          {txn.name ? (
                            <span className="text-slate-900">{txn.name}</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {hasErrors && txn.status !== 'success' ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="cursor-pointer">
                                  {getStatusBadge(txn.status)}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80" align="start">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-red-600 font-medium">
                                    <AlertCircle className="h-4 w-4" />
                                    Validation Errors
                                  </div>
                                  <ul className="text-sm space-y-1">
                                    {txn.validationErrors.map((error, idx) => (
                                      <li key={idx} className="text-slate-600 flex items-start gap-2">
                                        <span className="text-red-400 mt-1">•</span>
                                        {error}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            getStatusBadge(txn.status)
                          )}
                        </TableCell>
                        <TableCell>{getSourceBadge(txn.source)}</TableCell>
                        <TableCell className="text-sm text-slate-500">{txn.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={!isClickable}
                            onClick={() => {
                              if (isClickable) {
                                navigate(createPageUrl('ValidationDetail') + `?id=${txn.id}`);
                              }
                            }}
                          >
                            <Eye className={`h-4 w-4 ${!isClickable ? 'text-slate-300' : ''}`} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Footer with Pagination and Stats */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>Rows per page</span>
                <Select value={rowsPerPage.toString()} onValueChange={(v) => setRowsPerPage(Number(v))}>
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-6">
                {/* Distinct Count */}
                <div className="text-sm">
                  <span className="text-slate-500">Distinct {activeTab === 'eid' ? 'EIDs' : 'Passports'}: </span>
                  <span className="font-semibold text-slate-900">{distinctCount}</span>
                </div>

                {/* Page Info */}
                <span className="text-sm text-slate-500">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <span className="text-sm text-slate-500">
                  Total: {filteredTransactions.length} Transactions
                </span>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
