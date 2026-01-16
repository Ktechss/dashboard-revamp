import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  FileText,
  Copy
} from 'lucide-react';
import { createPageUrl } from '@/utils';

// Mock transaction detail data
const MOCK_TRANSACTION = {
  id: '7c72b5fc-2f6f-4adf-864d-56ba5005091b',
  emiratesId: '784199989399409',
  organizationId: '33fd7e4c-915c-4263-b098-439fe0619e24',
  processingTime: '141ms',
  createdAt: 'Jan 12, 2026 13:48:55',
  status: 'success',
  requestDetails: {
    request_ip: 'batch-processing',
    request_payload: {
      date_of_birth: '1999-10-26',
      eid_expiry_date: '2027-01-01',
      eid_issue_date: '2019-01-01',
      emirates_id: '784199989399409',
      nationality: 'IND'
    },
    request_type: 'eid_validation',
    timestamp: '2026-01-12T09:48:55.762239752'
  },
  responseDetails: {
    data: {
      cardNumber: '000000000',
      dateOfBirth: '1999-10-26',
      eidExpiryDate: '2027-01-01',
      eidIssueDate: '2019-01-01',
      fullNameArabic: 'جون دو',
      fullNameEnglish: 'JOHN DOE',
      nationality: 'IND'
    },
    validations: {
      dateOfBirthStatus: 'CORRECT',
      eidExpiryDateStatus: 'CORRECT',
      eidIssueDateStatus: 'CORRECT',
      eidStatus: 'ACTIVE',
      nationalityStatus: 'CORRECT',
      visaStatus: 'ACTIVE'
    }
  },
  metadata: {
    origin: 'api'
  },
  certificate: {
    status: 'Generated',
    generatedAt: 'Jan 12, 2026 13:49:00',
    reportId: 'RPT-7c72b5fc',
    organizationName: 'Regulator ICP',
    emiratesIdInfo: {
      emiratesId: '784199989399409',
      cardNumber: '000000000',
      issueDate: '2019-01-01',
      expiryDate: '2027-01-01'
    },
    personalInfo: {
      fullNameEnglish: 'JOHN DOE',
      fullNameArabic: 'جون دو',
      dateOfBirth: '1999-10-26',
      nationality: 'IND'
    }
  }
};

export default function ValidationDetail({ selectedOrganization }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('id') || MOCK_TRANSACTION.id;

  // In real app, fetch transaction by ID
  const transaction = MOCK_TRANSACTION;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusBadge = (status, size = 'default') => {
    const baseClass = size === 'small' ? 'text-xs px-2 py-0.5' : '';
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'CORRECT':
      case 'ACTIVE':
        return (
          <Badge className={`bg-green-100 text-green-700 hover:bg-green-100 border-0 ${baseClass}`}>
            {status.toUpperCase()}
          </Badge>
        );
      case 'ERROR':
      case 'FAILED':
      case 'INCORRECT':
        return (
          <Badge className={`bg-red-100 text-red-700 hover:bg-red-100 border-0 ${baseClass}`}>
            {status.toUpperCase()}
          </Badge>
        );
      default:
        return <Badge variant="outline" className={baseClass}>{status}</Badge>;
    }
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
                onClick={() => navigate(createPageUrl('Validation'))}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">Transaction Details</h1>
                  {getStatusBadge(transaction.status)}
                </div>
                <p className="text-sm text-slate-500 mt-1">ID: {transaction.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500">Emirates ID</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold font-mono">{transaction.emiratesId}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(transaction.emiratesId)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Organization ID</p>
                  <p className="text-sm font-mono text-slate-700">{transaction.organizationId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Processing Time</p>
                  <p className="text-sm font-semibold">{transaction.processingTime}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Created At</p>
                  <p className="text-sm">{transaction.createdAt}</p>
                </div>
              </CardContent>
            </Card>

            {/* Request Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Request Details</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-50 p-4 rounded-lg text-xs font-mono overflow-auto max-h-64">
                  {JSON.stringify(transaction.requestDetails, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {/* Response Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Response Details</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-50 p-4 rounded-lg text-xs font-mono overflow-auto max-h-80">
                  {JSON.stringify(transaction.responseDetails, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-50 p-4 rounded-lg text-xs font-mono">
                  {JSON.stringify(transaction.metadata, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Validation Certificate */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <CardTitle className="text-base">Validation Certificate</CardTitle>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Generated on {transaction.certificate.generatedAt}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Certificate Status</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 mt-1">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {transaction.certificate.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>

                <Separator />

                {/* Certificate Preview */}
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-sky-700">Identity Verification System</h3>
                      <p className="text-xs text-slate-500">Federal Authority of ICP</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p className="font-medium">Emirates ID Validation Report</p>
                      <p>Report #: {transaction.certificate.reportId}</p>
                      <p>Generated: {transaction.certificate.generatedAt}</p>
                    </div>
                  </div>

                  {/* Organization Details */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-green-700 mb-2">Organization Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Organization:</span>
                        <span className="ml-2">{transaction.certificate.organizationName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Organization ID:</span>
                        <span className="ml-2 font-mono text-[10px]">{transaction.organizationId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Emirates ID Information */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-sky-700 mb-2">Emirates ID Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Emirates ID:</span>
                        <span className="ml-2 font-mono">{transaction.certificate.emiratesIdInfo.emiratesId}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Card Number:</span>
                        <span className="ml-2 font-mono">{transaction.certificate.emiratesIdInfo.cardNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Issue Date:</span>
                        <span className="ml-2">{transaction.certificate.emiratesIdInfo.issueDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Expiry Date:</span>
                        <span className="ml-2">{transaction.certificate.emiratesIdInfo.expiryDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-green-700 mb-2">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Full Name (English):</span>
                        <span className="ml-2">{transaction.certificate.personalInfo.fullNameEnglish}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Full Name (Arabic):</span>
                        <span className="ml-2">{transaction.certificate.personalInfo.fullNameArabic}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Date of Birth:</span>
                        <span className="ml-2">{transaction.certificate.personalInfo.dateOfBirth}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Nationality:</span>
                        <span className="ml-2">{transaction.certificate.personalInfo.nationality}</span>
                      </div>
                    </div>
                  </div>

                  {/* Validation Results */}
                  <div>
                    <h4 className="text-sm font-medium text-green-700 mb-2">Validation Results</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Emirates ID Number:</span>
                        {getStatusBadge('CORRECT', 'small')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Emirates ID Status:</span>
                        {getStatusBadge('ACTIVE', 'small')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Visa Status:</span>
                        {getStatusBadge('ACTIVE', 'small')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Date of Birth:</span>
                        {getStatusBadge('CORRECT', 'small')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Nationality:</span>
                        {getStatusBadge('CORRECT', 'small')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Issue Date:</span>
                        {getStatusBadge('CORRECT', 'small')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Processing Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Status</p>
                    {getStatusBadge(transaction.status)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Processing Time</p>
                    <p className="font-semibold">{transaction.processingTime}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-3">Validation Results</p>
                  <div className="space-y-2">
                    {Object.entries(transaction.responseDetails.validations).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('Status', '')}:
                        </span>
                        {getStatusBadge(value, 'small')}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
