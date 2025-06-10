import React, { useEffect, useState } from 'react';
import { FileText, Filter, RefreshCw, Eye, Download, Send, ChevronRight } from 'lucide-react';
import { allReports } from './constant';
import { REPORT_FILTERS } from '../components/constant';
import axios from 'axios';

const ReportItem = React.memo(({ report, isSelected, onSelect }) => {
  const downloadPDF = async (filename, shouldOpen = false) => {
    try {
      const response = await fetch(`http://localhost:3001/download/${filename}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      if (shouldOpen) {
        // For viewing - open in new tab first, then cleanup
        window.open(url, '_blank');
        // Delay the cleanup to ensure the file opens
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } else {
        // For downloading - create temporary link and click
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error handling file:', error);
    }
  };

  const handleView = async (e) => {
    e.stopPropagation();
    if (report.reportPath) {
      try {
        const filename = report.reportPath.split('/').pop();
        await downloadPDF(filename, true); // Pass true for viewing
      } catch (error) {
        console.error('Error viewing report:', error);
      }
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (report.reportPath) {
      try {
        const filename = report.reportPath.split('/').pop();
        await downloadPDF(filename, false); // Pass false for downloading
      } catch (error) {
        console.error('Error downloading report:', error);
      }
    }
  };

  return (
    <div 
      className={`report-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(report)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="report-header">
            <h4 className="report-title">
              {report.country} - {report.organization}
            </h4>

            {/* Optional: only show if severity/status are available */}
            {report.severity && (
              <span className={`severity-badge ${report.severity}`}>
                {report.severity} severity
              </span>
            )}
            {report.status && (
              <span className={`status-badge ${report.status}`}>
                {report.status}
              </span>
            )}
          </div>

          <div className="report-meta">
            Generated on {new Date(report.generatedDate).toLocaleString()}
          </div>

          <div className="report-findings">
            <p className="report-findings-title">Key Findings:</p>
            <ul>
  {report.previewText
    ?.split(' - ') // Split previewText into individual findings
    ?.map((finding, idx) => (
      <li key={idx} className="finding-item">
        {finding.trim().replace(/^-\s*/, '')} {/* Remove leading dash and spaces */}
      </li>
    ))}
</ul>
          </div>
        </div>
        <div className="list-item-actions">
          <button className="icon-button" onClick={handleView}>
            <Eye size={20} />
          </button>
          <button className="icon-button" onClick={handleDownload}>
            <Download size={20} />
          </button>
          {/* <button className="icon-button">
            <Send size={20} />
          </button> */}
        </div>
      </div>
    </div>
  );
});

// const ReportPreview = React.memo(({ report }) => (
//   <div className="content-card">
//     <h3 className="content-card-header">Report Preview</h3>
//     <div className="prompt-content">
//       <div className="mb-4">
//         <h4 style={{ color: '#a78bfa', fontWeight: 600, marginBottom: 8 }}>Executive Summary</h4>
//         <p style={{ color: '#d1d5db' }}>
//           This weekly security intelligence report for {report.country} identifies {report.incidents} security 
//           incidents affecting humanitarian operations. The overall security environment is assessed as {report.severity} risk, 
//           requiring enhanced security measures for {report.org} personnel and operations.
//         </p>
//       </div>
//       <div className="mb-4">
//         <h4 style={{ color: '#a78bfa', fontWeight: 600, marginBottom: 8 }}>Recipients</h4>
//         <div className="tag-container">
//           {report.recipients?.map((email, idx) => (
//             <span key={idx} style={{ 
//               padding: '4px 12px', 
//               backgroundColor: '#1f2937', 
//               borderRadius: '8px',
//               fontSize: '14px',
//               color: '#d1d5db'
//             }}>
//               {email}
//             </span>
//           ))}
//         </div>
//       </div>
//       <div className="flex items-center gap-4 mt-6">
//         <button className="primary-button">
//           View Full Report
//         </button>
//         <button className="save-button" style={{ background: '#4b5563' }}>
//           Edit Report
//         </button>
//         <button className="cancel-button" style={{ 
//           border: '1px solid #4b5563',
//           borderRadius: '8px',
//           padding: '8px 16px'
//         }}>
//           Export as PDF
//         </button>
//       </div>
//     </div>
//   </div>
// ));

const Reports = ({ selectedReport, onReportSelect }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/all-reports');
        console.log('API Response:', response.data);
        setReports(response.data.reports);
        setError(null);
      } catch (err) {
        setError('Failed to fetch reports. Please try again later.');
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="content-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="content-card-header" style={{ marginBottom: 0 }}>
            <FileText size={20} className="icon-purple" />
            Generated Reports
          </h3>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading reports...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : reports && reports.length > 0 ? (
            reports.map(report => (
              <ReportItem
                key={report.id}
                report={report}
                isSelected={selectedReport?.id === report.id}
                onSelect={onReportSelect}
              />
            ))
          ) : (
            <div className="text-center py-4">No reports found</div>
          )}
        </div>
      </div>

      {/* {selectedReport && <ReportPreview report={selectedReport} />} */}
    </div>
  );
};

export default React.memo(Reports);