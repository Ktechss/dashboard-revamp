import { useState, useRef, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  Search,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';

// Initial mock batches
const INITIAL_BATCHES = [
  {
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
  },
];

// Helper to get batches from localStorage or use initial
const getBatchesFromStorage = () => {
  const stored = localStorage.getItem('batchValidations');
  if (stored) {
    const batches = JSON.parse(stored);
    // Check if batches have records (new format), otherwise reset
    if (batches.length > 0 && batches[0].records) {
      return batches;
    }
  }
  // Reset to initial batches with records
  localStorage.setItem('batchValidations', JSON.stringify(INITIAL_BATCHES));
  return INITIAL_BATCHES;
};

// Helper to save batches to localStorage
const saveBatchesToStorage = (batches) => {
  localStorage.setItem('batchValidations', JSON.stringify(batches));
};

// Parse CSV text to records
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length === headers.length) {
      const record = {};
      headers.forEach((header, idx) => {
        record[header] = values[idx];
      });
      record.rowNumber = i;
      records.push(record);
    }
  }
  return records;
};

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
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [batches, setBatches] = useState([]);

  // Modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedRecords, setParsedRecords] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Load batches from localStorage on mount
  useEffect(() => {
    setBatches(getBatchesFromStorage());
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target.result;
        const records = parseCSV(csvText);
        setSelectedFile(file);
        setParsedRecords(records);
        setUploadModalOpen(true);
      };
      reader.readAsText(file);
    }
    // Reset input
    e.target.value = '';
  };

  const handleConfirmUpload = () => {
    if (!selectedFile || parsedRecords.length === 0) return;

    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const newBatch = {
        id: `batch-${Date.now()}`,
        fileName: selectedFile.name,
        status: 'completed',
        progress: 100,
        totalRecords: parsedRecords.length,
        successCount: parsedRecords.length,
        failedCount: 0,
        createdAt: new Date().toLocaleString(),
        records: parsedRecords
      };

      const updatedBatches = [newBatch, ...batches];
      setBatches(updatedBatches);
      saveBatchesToStorage(updatedBatches);

      // Reset modal state
      setIsUploading(false);
      setUploadModalOpen(false);
      setSelectedFile(null);
      setParsedRecords([]);
    }, 1000);
  };

  const handleCancelUpload = () => {
    setUploadModalOpen(false);
    setSelectedFile(null);
    setParsedRecords([]);
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-8xl mx-auto px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Batch Validation</h1>
          <p className="text-slate-500 mt-1">Manage and monitor your CSV batch validation jobs</p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-8 py-6">
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

        {/* Batch Jobs Table */}
        <Card>
          <CardContent className="p-6">
            {/* Filters */}
            <div className="flex items-center justify-between gap-4 mb-4">
              {/* Search - Left */}
              <div className="relative w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by filename or batch ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters & Upload - Right */}
              <div className="flex items-center gap-3">
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

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv"
                  className="hidden"
                />
                <Button className="bg-slate-900 hover:bg-slate-800" onClick={handleUploadClick}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
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
                        <div className="w-[100px]">
                          <Progress value={batch.progress || 0} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{batch.totalRecords}</TableCell>
                      <TableCell>
                        <span className="font-medium">
                          <span className="text-green-600">{batch.successCount || 0}</span>
                          <span className="text-slate-400">/</span>
                          <span className="text-slate-600">{batch.totalRecords}</span>
                        </span>
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

      {/* Upload CSV Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload CSV File</DialogTitle>
            <DialogDescription>
              Review the file details before uploading
            </DialogDescription>
          </DialogHeader>

          {selectedFile && (
            <div className="space-y-4 py-4">
              {/* File Info */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <FileText className="h-10 w-10 text-slate-400" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCancelUpload}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Records Preview */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Records Found</span>
                  <span className="text-lg font-bold text-slate-900">{parsedRecords.length}</span>
                </div>
                {parsedRecords.length > 0 && (
                  <div className="text-xs text-slate-500">
                    <p>Columns detected: {Object.keys(parsedRecords[0]).filter(k => k !== 'rowNumber').join(', ')}</p>
                  </div>
                )}
              </div>

              {/* Preview Table (first 3 records) */}
              {parsedRecords.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-3 py-2 border-b">
                    <span className="text-xs font-medium text-slate-600">Preview (first 3 records)</span>
                  </div>
                  <div className="max-h-32 overflow-auto">
                    <Table>
                      <TableBody>
                        {parsedRecords.slice(0, 3).map((record, index) => (
                          <TableRow key={index} className="text-xs">
                            <TableCell className="py-2 font-mono">{record.eid_number || record.customer_id || '—'}</TableCell>
                            <TableCell className="py-2">{record.name_on_eid || record.name || '—'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelUpload} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleConfirmUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Proceed
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
