import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Search,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  CheckCircle2,
  XCircle,
  Minus
} from 'lucide-react';

// Mock Government EID Database (Source of Truth)
const GOVT_EID_DATABASE = {
  '784199138421583': {
    eid_number: '784199138421583',
    card_number: '1234567890',
    full_name_english: 'AYAH N M ALBURAI',
    full_name_arabic: 'آية البوراعي',
    date_of_birth: '1990-05-15',
    nationality: 'PSE',
    eid_issue_date: '2020-01-15',
    eid_expiry_date: '2025-01-15',
    gender: 'Female',
    eid_status: 'ACTIVE',
    visa_status: 'ACTIVE'
  },
  '784199989399409': {
    eid_number: '784199989399409',
    card_number: '000000000',
    full_name_english: 'SACHIN DUHAN',
    full_name_arabic: 'ساشين دوهان',
    date_of_birth: '1999-10-26',
    nationality: 'IND',
    eid_issue_date: '2019-01-01',
    eid_expiry_date: '2027-01-01',
    gender: 'Male',
    eid_status: 'ACTIVE',
    visa_status: 'ACTIVE'
  },
  '784198855404228': {
    eid_number: '784198855404228',
    card_number: '9876543210',
    full_name_english: 'AHMED HASSAN ALI',
    full_name_arabic: 'أحمد حسن علي',
    date_of_birth: '1985-03-22',
    nationality: 'EGY',
    eid_issue_date: '2018-06-10',
    eid_expiry_date: '2026-06-10',
    gender: 'Male',
    eid_status: 'ACTIVE',
    visa_status: 'ACTIVE'
  },
  '784200123456789': {
    eid_number: '784200123456789',
    card_number: '5555555555',
    full_name_english: 'FATIMA KHAN',
    full_name_arabic: 'فاطمة خان',
    date_of_birth: '1992-07-18',
    nationality: 'PAK',
    eid_issue_date: '2021-02-20',
    eid_expiry_date: '2024-02-20',
    gender: 'Female',
    eid_status: 'EXPIRED',
    visa_status: 'EXPIRED'
  }
};

// Mock EID transaction data with field validations
const MOCK_EID_TRANSACTIONS = [
  {
    id: 'a04ebb0f-1234-5678-9abc-def012345678',
    emiratesId: '784199989399409',
    source: 'Batch',
    batchId: '9c955c5f-d76e-4004-80d5-69c8c497f4b3',
    batchName: 'eid_batch (2).csv',
    createdAt: 'Jan 12, 2026 13:49',
    status: 'success',
    submitted_data: {
      name: 'SACHIN DUHAN',
      dob: '1999-10-26',
      eid_issue_date: '2019-01-01',
      eid_expiry_date: '2027-01-01'
    },
    govt_data: {
      cardNumber: '000000000',
      dateOfBirth: '1999-10-26',
      eidExpiryDate: '2027-01-01',
      eidIssueDate: '2019-01-01',
      fullNameArabic: 'ساشين دوهان',
      fullNameEnglish: 'SACHIN DUHAN',
      nationality: 'IND'
    },
    validations: {
      nameStatus: 'CORRECT',
      dateOfBirthStatus: 'CORRECT',
      eidIssueDateStatus: 'CORRECT',
      eidExpiryDateStatus: 'CORRECT',
      eidStatus: 'ACTIVE',
      visaStatus: 'ACTIVE',
      nationalityStatus: 'CORRECT'
    }
  },
  {
    id: '66dccfd8-2345-6789-abcd-ef0123456789',
    emiratesId: '784198855404228',
    source: 'API',
    batchId: null,
    batchName: null,
    createdAt: 'Jan 12, 2026 13:48',
    status: 'success',
    submitted_data: {
      name: 'AHMED HASSAN ALI',
      dob: '1985-03-22',
      eid_issue_date: '2018-06-10',
      eid_expiry_date: '2026-06-10'
    },
    govt_data: {
      cardNumber: '9876543210',
      dateOfBirth: '1985-03-22',
      eidExpiryDate: '2026-06-10',
      eidIssueDate: '2018-06-10',
      fullNameArabic: 'أحمد حسن علي',
      fullNameEnglish: 'AHMED HASSAN ALI',
      nationality: 'EGY'
    },
    validations: {
      nameStatus: 'CORRECT',
      dateOfBirthStatus: 'CORRECT',
      eidIssueDateStatus: 'CORRECT',
      eidExpiryDateStatus: 'CORRECT',
      eidStatus: 'ACTIVE',
      visaStatus: 'ACTIVE',
      nationalityStatus: 'CORRECT'
    }
  },
  {
    id: '73a6bdc0-3456-789a-bcde-f01234567890',
    emiratesId: '784199138421583',
    source: 'Batch',
    batchId: '9c955c5f-d76e-4004-80d5-69c8c497f4b3',
    batchName: 'eid_batch (2).csv',
    createdAt: 'Jan 11, 2026 10:30',
    status: 'partial',
    submitted_data: {
      name: 'AYAH ALBURAI',
      dob: '1990-05-15',
      eid_issue_date: '2020-01-15',
      eid_expiry_date: '2026-01-15'
    },
    govt_data: {
      cardNumber: '1234567890',
      dateOfBirth: '1990-05-15',
      eidExpiryDate: '2025-01-15',
      eidIssueDate: '2020-01-15',
      fullNameArabic: 'آية البوراعي',
      fullNameEnglish: 'AYAH N M ALBURAI',
      nationality: 'PSE'
    },
    validations: {
      nameStatus: 'INCORRECT',
      dateOfBirthStatus: 'CORRECT',
      eidIssueDateStatus: 'CORRECT',
      eidExpiryDateStatus: 'INCORRECT',
      eidStatus: 'ACTIVE',
      visaStatus: 'ACTIVE',
      nationalityStatus: 'CORRECT'
    }
  },
  {
    id: 'ab645741-4567-89ab-cdef-012345678901',
    emiratesId: '784200123456789',
    source: 'API',
    batchId: null,
    batchName: null,
    createdAt: 'Jan 10, 2026 15:22',
    status: 'partial',
    submitted_data: {
      name: 'FATIMA KHAN',
      dob: '1992-07-18',
      eid_issue_date: '2021-02-20',
      eid_expiry_date: '2024-02-20'
    },
    govt_data: {
      cardNumber: '5555555555',
      dateOfBirth: '1992-07-18',
      eidExpiryDate: '2024-02-20',
      eidIssueDate: '2021-02-20',
      fullNameArabic: 'فاطمة خان',
      fullNameEnglish: 'FATIMA KHAN',
      nationality: 'PAK'
    },
    validations: {
      nameStatus: 'CORRECT',
      dateOfBirthStatus: 'CORRECT',
      eidIssueDateStatus: 'CORRECT',
      eidExpiryDateStatus: 'CORRECT',
      eidStatus: 'EXPIRED',
      visaStatus: 'EXPIRED',
      nationalityStatus: 'CORRECT'
    }
  },
  {
    id: '7c72b5fc-5678-9abc-def0-123456789012',
    emiratesId: '784201999888777',
    source: 'Batch',
    batchId: 'eca7849b-cc0b-4e34-88a9-99d2530df50f',
    batchName: 'eid_new.csv',
    createdAt: 'Jan 10, 2026 14:00',
    status: 'not_found',
    submitted_data: {
      name: 'UNKNOWN PERSON',
      dob: '1988-01-01',
      eid_issue_date: '2020-01-01',
      eid_expiry_date: '2025-01-01'
    },
    govt_data: null,
    validations: null
  },
  {
    id: 'b68ab45d-6789-abcd-ef01-234567890123',
    emiratesId: '784199989399409',
    source: 'API',
    batchId: null,
    batchName: null,
    createdAt: 'Jan 8, 2026 19:59',
    status: 'success',
    submitted_data: {
      name: 'SACHIN DUHAN',
      dob: '1999-10-26',
      eid_issue_date: '2019-01-01',
      eid_expiry_date: '2027-01-01'
    },
    govt_data: {
      cardNumber: '000000000',
      dateOfBirth: '1999-10-26',
      eidExpiryDate: '2027-01-01',
      eidIssueDate: '2019-01-01',
      fullNameArabic: 'ساشين دوهان',
      fullNameEnglish: 'SACHIN DUHAN',
      nationality: 'IND'
    },
    validations: {
      nameStatus: 'CORRECT',
      dateOfBirthStatus: 'CORRECT',
      eidIssueDateStatus: 'CORRECT',
      eidExpiryDateStatus: 'CORRECT',
      eidStatus: 'ACTIVE',
      visaStatus: 'ACTIVE',
      nationalityStatus: 'CORRECT'
    }
  }
];

// Mock Passport Government Database
const GOVT_PASSPORT_DATABASE = {
  'AB1234567': {
    passport_number: 'AB1234567',
    full_name: 'JOHN SMITH WILLIAMS',
    date_of_birth: '1985-06-15',
    nationality: 'GBR',
    passport_issue_date: '2020-03-10',
    passport_expiry_date: '2030-03-10',
    gender: 'Male',
    passport_status: 'VALID'
  },
  'EF5432167': {
    passport_number: 'EF5432167',
    full_name: 'MARIA GARCIA LOPEZ',
    date_of_birth: '1990-11-22',
    nationality: 'ESP',
    passport_issue_date: '2019-07-01',
    passport_expiry_date: '2029-07-01',
    gender: 'Female',
    passport_status: 'VALID'
  }
};

// Mock Passport transaction data
const MOCK_PASSPORT_TRANSACTIONS = [
  {
    id: 'pp-a1b2c3d4-1234-5678-9abc-def012345678',
    passportNumber: 'AB1234567',
    source: 'API',
    batchId: null,
    batchName: null,
    createdAt: 'Jan 14, 2026 10:30',
    status: 'success',
    submitted_data: {
      name: 'JOHN SMITH WILLIAMS',
      dob: '1985-06-15',
      passport_expiry_date: '2030-03-10'
    },
    govt_data: {
      passportNumber: 'AB1234567',
      fullName: 'JOHN SMITH WILLIAMS',
      dateOfBirth: '1985-06-15',
      nationality: 'GBR',
      passportExpiryDate: '2030-03-10',
      passportIssueDate: '2020-03-10'
    },
    validations: {
      nameStatus: 'CORRECT',
      dateOfBirthStatus: 'CORRECT',
      passportExpiryDateStatus: 'CORRECT',
      passportStatus: 'VALID',
      nationalityStatus: 'CORRECT'
    }
  },
  {
    id: 'pp-e5f6g7h8-2345-6789-abcd-ef0123456789',
    passportNumber: 'CD9876543',
    source: 'Batch',
    batchId: 'abc123-processing',
    batchName: 'passport_batch.csv',
    createdAt: 'Jan 14, 2026 09:15',
    status: 'not_found',
    submitted_data: {
      name: 'UNKNOWN TRAVELER',
      dob: '1980-01-01',
      passport_expiry_date: '2025-01-01'
    },
    govt_data: null,
    validations: null
  },
  {
    id: 'pp-i9j0k1l2-3456-789a-bcde-f01234567890',
    passportNumber: 'EF5432167',
    source: 'API',
    batchId: null,
    batchName: null,
    createdAt: 'Jan 13, 2026 16:45',
    status: 'partial',
    submitted_data: {
      name: 'MARIA GARCIA',
      dob: '1990-11-22',
      passport_expiry_date: '2029-07-01'
    },
    govt_data: {
      passportNumber: 'EF5432167',
      fullName: 'MARIA GARCIA LOPEZ',
      dateOfBirth: '1990-11-22',
      nationality: 'ESP',
      passportExpiryDate: '2029-07-01',
      passportIssueDate: '2019-07-01'
    },
    validations: {
      nameStatus: 'INCORRECT',
      dateOfBirthStatus: 'CORRECT',
      passportExpiryDateStatus: 'CORRECT',
      passportStatus: 'VALID',
      nationalityStatus: 'CORRECT'
    }
  }
];

export default function Validation({ selectedOrganization }) {
  // Check which validation APIs are enabled for the organization
  const hasEidValidation = selectedOrganization?.validation_config?.eid_validation?.enabled ?? true;
  const hasPassportValidation = selectedOrganization?.validation_config?.passport_validation?.enabled ?? true;

  // Default to the first enabled tab
  const defaultTab = hasEidValidation ? 'eid' : (hasPassportValidation ? 'passport' : 'eid');

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const transactions = activeTab === 'eid' ? MOCK_EID_TRANSACTIONS : MOCK_PASSPORT_TRANSACTIONS;
  const idField = activeTab === 'eid' ? 'emiratesId' : 'passportNumber';
  const idLabel = activeTab === 'eid' ? 'Emirates ID' : 'Passport Number';

  // Filter transactions
  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = searchQuery === '' ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn[idField].includes(searchQuery) ||
      (txn.govt_data?.fullNameEnglish?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       txn.govt_data?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || txn.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + rowsPerPage);

  const handleViewTransaction = (txn) => {
    setSelectedTransaction(txn);
    setSheetOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
            SUCCESS
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
            PARTIAL
          </Badge>
        );
      case 'not_found':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
            NOT FOUND
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
            ERROR
          </Badge>
        );
      default:
        return <Badge variant="outline">{status?.toUpperCase()}</Badge>;
    }
  };

  const getSourceBadge = (source) => {
    return source === 'Batch' ? (
      <Badge variant="outline" className="text-xs">Batch</Badge>
    ) : (
      <Badge variant="outline" className="text-xs bg-sky-50 text-sky-700 border-sky-200">API</Badge>
    );
  };

  // Render validation indicator (✓, ✗, or —)
  const ValidationIcon = ({ status }) => {
    if (!status) {
      return <Minus className="h-4 w-4 text-slate-300" />;
    }
    if (status === 'CORRECT' || status === 'ACTIVE' || status === 'VALID') {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  // Get name with validation indicator
  const getNameWithStatus = (txn) => {
    if (!txn.govt_data) {
      return (
        <div className="flex items-center gap-2 text-slate-400">
          <span>NOT FOUND</span>
          <Minus className="h-4 w-4" />
        </div>
      );
    }
    const name = activeTab === 'eid' ? txn.govt_data.fullNameEnglish : txn.govt_data.fullName;
    const status = txn.validations?.nameStatus;
    return (
      <div className="flex items-center gap-2">
        <span className={status === 'CORRECT' ? 'text-slate-900' : 'text-red-600'}>{name}</span>
        <ValidationIcon status={status} />
      </div>
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-8xl mx-auto px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Validation Transactions</h1>
          <p className="text-slate-500 mt-1">Browse and manage all validation transactions</p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-8 py-6">
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
            <div className="flex items-center justify-between gap-4 mb-6">
              {/* Search - Left */}
              <div className="relative w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by ID, name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters - Right */}
              <div className="flex items-center gap-3">
                {/* Created At Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-[150px]"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="not_found">Not Found</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>

                {/* Source Filter */}
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                    <SelectItem value="Batch">Batch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>{idLabel}</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((txn) => {
                    const govtData = txn.govt_data;
                    const validations = txn.validations;

                    return (
                      <TableRow key={txn.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-600">{txn.id.substring(0, 8)}...</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(txn.id)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{txn[idField]}</span>
                        </TableCell>
                        <TableCell>
                          {getNameWithStatus(txn)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-700">
                              {govtData?.dateOfBirth || '—'}
                            </span>
                            <ValidationIcon status={validations?.dateOfBirthStatus} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-700">
                              {activeTab === 'eid'
                                ? (govtData?.eidIssueDate || '—')
                                : (govtData?.passportIssueDate || '—')
                              }
                            </span>
                            <ValidationIcon status={activeTab === 'eid' ? validations?.eidIssueDateStatus : validations?.passportIssueDateStatus} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-700">
                              {activeTab === 'eid'
                                ? (govtData?.eidExpiryDate || '—')
                                : (govtData?.passportExpiryDate || '—')
                              }
                            </span>
                            <ValidationIcon status={activeTab === 'eid' ? validations?.eidExpiryDateStatus : validations?.passportExpiryDateStatus} />
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(txn.status)}
                        </TableCell>
                        <TableCell>{getSourceBadge(txn.source)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewTransaction(txn)}
                          >
                            <Eye className="h-4 w-4" />
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

      {/* Detail Side Panel */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle>Transaction Details</SheetTitle>
              {selectedTransaction && getStatusBadge(selectedTransaction.status)}
            </div>
            {selectedTransaction && (
              <p className="text-sm text-slate-500 font-mono">{selectedTransaction.id}</p>
            )}
          </SheetHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Basic Information</h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Transaction ID</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-medium">{selectedTransaction.id}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => copyToClipboard(selectedTransaction.id)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">{idLabel}</span>
                    <span className="text-sm font-mono font-medium">{selectedTransaction[idField]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Source</span>
                    <span className="text-sm">{selectedTransaction.source}</span>
                  </div>
                  {selectedTransaction.source === 'Batch' && selectedTransaction.batchId && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Batch Name</span>
                        <span className="text-sm font-medium">{selectedTransaction.batchName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Batch ID</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-600">{selectedTransaction.batchId.substring(0, 8)}...</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => copyToClipboard(selectedTransaction.batchId)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Created At</span>
                    <span className="text-sm">{selectedTransaction.createdAt}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Government Data */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Government Data</h3>
                {selectedTransaction.govt_data ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableBody>
                        {activeTab === 'eid' ? (
                          <>
                            <TableRow>
                              <TableCell className="font-medium text-slate-600 bg-slate-50 w-40">Card Number</TableCell>
                              <TableCell className="font-mono">{selectedTransaction.govt_data.cardNumber}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-slate-600 bg-slate-50">Full Name (English)</TableCell>
                              <TableCell>{selectedTransaction.govt_data.fullNameEnglish}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-slate-600 bg-slate-50">Full Name (Arabic)</TableCell>
                              <TableCell className="text-right" dir="rtl">{selectedTransaction.govt_data.fullNameArabic}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-slate-600 bg-slate-50">Date of Birth</TableCell>
                              <TableCell>{selectedTransaction.govt_data.dateOfBirth}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-slate-600 bg-slate-50">Nationality</TableCell>
                              <TableCell>{selectedTransaction.govt_data.nationality}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-slate-600 bg-slate-50">EID Issue Date</TableCell>
                              <TableCell>{selectedTransaction.govt_data.eidIssueDate}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-slate-600 bg-slate-50">EID Expiry Date</TableCell>
                              <TableCell>{selectedTransaction.govt_data.eidExpiryDate}</TableCell>
                            </TableRow>
                          </>
                        ) : (
                          <>
                            <TableRow>
                              <TableCell className="font-medium text-slate-600 bg-slate-50 w-40">Passport Number</TableCell>
                              <TableCell className="font-mono">{selectedTransaction.govt_data.passportNumber}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-slate-600 bg-slate-50">Full Name</TableCell>
                              <TableCell>{selectedTransaction.govt_data.fullName}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-slate-600 bg-slate-50">Date of Birth</TableCell>
                              <TableCell>{selectedTransaction.govt_data.dateOfBirth}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-slate-600 bg-slate-50">Nationality</TableCell>
                              <TableCell>{selectedTransaction.govt_data.nationality}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-slate-600 bg-slate-50">Issue Date</TableCell>
                              <TableCell>{selectedTransaction.govt_data.passportIssueDate}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium text-slate-600 bg-slate-50">Expiry Date</TableCell>
                              <TableCell>{selectedTransaction.govt_data.passportExpiryDate}</TableCell>
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <p className="text-red-700 font-medium">Record Not Found</p>
                    <p className="text-red-600 text-sm">This {activeTab === 'eid' ? 'Emirates ID' : 'Passport'} was not found in the government database.</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Validation Results */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Validation Results</h3>
                {selectedTransaction.validations ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead>Field</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(selectedTransaction.validations).map(([key, value]) => {
                          const fieldName = key
                            .replace(/Status$/, '')
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase())
                            .trim();

                          const isCorrect = value === 'CORRECT' || value === 'ACTIVE' || value === 'VALID';

                          return (
                            <TableRow key={key}>
                              <TableCell className="font-medium text-slate-700">{fieldName}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {isCorrect ? (
                                    <>
                                      <span className="text-green-700">{value}</span>
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-red-700">{value}</span>
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="bg-slate-100 border rounded-lg p-4 text-center text-slate-500">
                    No validation results available
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
