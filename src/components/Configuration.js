import React, { useState } from "react";
import { MapPin, Users, Calendar, Mail, Zap, Plus, X } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  SCHEDULE_OPTIONS,
  OUTPUT_FORMATS,
  countries,
  organizations,
} from "../components/constant";

const Configuration = ({
  selectedCountries,
  setSelectedCountries,
  selectedOrgs,
  setSelectedOrgs,
  onReportGenerated,
  loading,
  setLoading
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState([
    "security@akdn.org",
    "reports@example.com",
  ]);
  const [newEmail, setNewEmail] = useState("");
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [reportPath, setReportPath] = useState("");
  console.log(keywords,'keywords')

const handleAddEmail = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (!newEmail) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (emailRecipients.includes(newEmail)) {
      setEmailError("This email is already added");
      return;
    }
    setEmailRecipients([...emailRecipients, newEmail]);
    setNewEmail("");
    setEmailError("");
  }
};
const handleEmailChange = (e) => {
  const value = e.target.value;
  setNewEmail(value);
  if (value && !validateEmail(value)) {
    setEmailError("Please enter a valid email address");
  } else {
    setEmailError("");
  }
};
  const handleRemoveEmail = (emailToRemove) => {
    setEmailRecipients(
      emailRecipients.filter((email) => email !== emailToRemove)
    );
  };

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newKeywords = keyword
        .split(',')
        .map(k => k.trim())
        .filter(k => k && !keywords.includes(k));
      
      if (newKeywords.length > 0) {
        setKeywords([...keywords, ...newKeywords]);
        setKeyword('');
      }
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  // Add useEffect to listen for generate-report event
  React.useEffect(() => {
    const handleGenerateReport = () => {
      handleSubmit(new Event('submit'));
    };

    document.addEventListener('generate-report', handleGenerateReport);
    return () => document.removeEventListener('generate-report', handleGenerateReport);
  }, [keywords, emailRecipients, selectedCountries, selectedOrgs]); // Add dependencies
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (selectedCountries.length === 0) {
      toast.error('Please select at least one country');
      return;
    }
    if (selectedOrgs.length === 0) {
      toast.error('Please select at least one organization');
      return;
    }
    if (keywords.length === 0) {
      toast.error('Please add at least one keyword');
      return;
    }
    if (emailRecipients.length === 0) {
      toast.error('Please add at least one email recipient');
      return;
    }

    setLoading(true);

    try {
      const formData = {
        country: selectedCountries.join(','),
        organization: selectedOrgs.join(','),
        keywords: keywords,
        emails: emailRecipients.join(','),
        frequency: 'Weekly',
      };

      const res = await axios.post('http://localhost:3001/generate-report', formData);
      setReportPath(res.data.reportPath);
      toast.success('Report generated successfully!');
      
      // Send the data back to dashboard
      if (onReportGenerated) {
        onReportGenerated({
          ...formData,
          reportPath: res.data.reportPath,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      toast.error('Error generating report');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const Modal = React.memo(({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button onClick={onClose} className="modal-close">
              <X size={24} />
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    );
  });

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="content-card">
        <h3 className="content-card-header">
          <MapPin size={20} className="icon-purple" />
          Countries Configuration
        </h3>
        <div className="tag-container mb-4">
          {selectedCountries?.map((country) => (
            <span key={country} className="tag purple">
              <span>{country}</span>
              <X
                size={16}
                className="tag-close"
                onClick={() =>
                  setSelectedCountries((prev) =>
                    prev.filter((c) => c !== country)
                  )
                }
              />
            </span>
          ))}
          <button
            onClick={() => setShowCountryModal(true)}
            className="add-button"
          >
            <Plus size={16} />
            <span>Add Country</span>
          </button>
        </div>
      </div>

      <div className="content-card">
        <h3 className="content-card-header">
          <Users size={20} className="icon-purple" />
          Organizations
        </h3>
        <div className="tag-container mb-4">
          {selectedOrgs?.map((org) => (
            <span key={org} className="tag blue">
              <span>{org}</span>
              <X
                size={16}
                className="tag-close"
                onClick={() =>
                  setSelectedOrgs((prev) => prev.filter((o) => o !== org))
                }
              />
            </span>
          ))}
            <button
            onClick={() => setShowOrgModal(true)}
            className="add-button"
          >
            <Plus size={16} />
            <span>Add Organization</span>
          </button>
        </div>
      </div>

      <div className="grid-2-col">
        <div className="content-card">
          <h3 className="content-card-header">
            <Calendar size={20} className="icon-purple" />
            Schedule Settings
          </h3>
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Report Frequency</label>
              <select className="form-select">
                {SCHEDULE_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input type="time" defaultValue="09:00" className="form-input" />
            </div>
            <div>
              <label className="form-label flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Enable human review before sending
              </label>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3 className="content-card-header">
            <Mail size={20} className="icon-purple" />
            Email Recipients
          </h3>
          <div className="space-y-3">
            <input
    type="email"
    placeholder="Add recipient email"
    className={`form-input ${emailError ? 'border-red-500' : ''}`}
    value={newEmail}
    onChange={handleEmailChange}
    onKeyPress={handleAddEmail}
  />
{emailError && (
  <p className="text-sm" style={{ color: '#ef4444', fontWeight: '500' }}>{emailError}</p>
)}
            <div className="list-space">
              {emailRecipients?.map((email) => (
                <div key={email} className="list-item">
                  <span style={{ color: "#d1d5db" }}>{email}</span>
                  <X
                    size={16}
                    className="hover-icon"
                    style={{ color: "#ef4444", cursor: "pointer" }}
                    onClick={() => handleRemoveEmail(email)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="content-card">
        <h3 className="content-card-header">
          <Mail size={20} className="icon-purple" />
          Keywords
        </h3>
        <div className="space-y-4">
          <div className="tag-container mb-4">
            {keywords.map((kw) => (
              <span key={kw} className="tag purple">
                <span>{kw}</span>
                <X 
                  size={16} 
                  className="tag-close"
                  onClick={() => handleRemoveKeyword(kw)}
                />
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add keywords (separate with commas)"
            className="form-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleAddKeyword}
          />
          <p className="text-sm text-gray-400 mt-2">
            Press Enter or comma to add keywords
          </p>
        </div>
      </div>
      {/* <div className="content-card">
        <h3 className="content-card-header">
          <Zap size={20} className="icon-purple" />
          Integration Settings
        </h3>
        <div
          className="grid-2-col"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          <div className="form-group">
            <label className="form-label">Output Format</label>
            <select className="form-select">
              {OUTPUT_FORMATS.map((format) => (
                <option key={format}>{format}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Slack Webhook</label>
            <input
              type="text"
              placeholder="https://hooks.slack.com/..."
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">OpenAI API Key</label>
            <input
              type="password"
              placeholder="sk-..."
              className="form-input"
            />
          </div>
        </div>
      </div> */}

      {/* Submit Button */}
      {/* <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`primary-button ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Generating Report...' : 'Generate Report'}
        </button>
      </div> */}

      <Modal
        show={showCountryModal}
        onClose={() => {
          setShowCountryModal(false);
          setSearchQuery("");
        }}
        title="Select Countries"
      >
        <input
          type="text"
          placeholder="Search countries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="selection-grid">
          {countries
            ?.filter((country) =>
              country.toLowerCase().includes(searchQuery.toLowerCase())
            )
            ?.map((country) => (
              <button
                key={country}
                onClick={() => {
                  if (!selectedCountries?.includes(country)) {
                    setSelectedCountries((prev) => [...prev, country]);
                  }
                  setShowCountryModal(false);
                  setSearchQuery("");
                }}
                className="selection-button"
              >
                {country}
              </button>
            ))}
        </div>
      </Modal>
       {/* Organization Selection Modal */}
       <Modal show={showOrgModal} onClose={() => setShowOrgModal(false)} title="Select Organizations">
        <div className="selection-grid">
          {organizations?.map(org => (
            <button
              key={org}
              onClick={() => {
                if (!selectedOrgs.includes(org)) {
                  setSelectedOrgs([...selectedOrgs, org]);
                }
                setShowOrgModal(false);
              }}
              className="selection-button"
            >
              {org}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(Configuration);
