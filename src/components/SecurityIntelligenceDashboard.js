import React, { useEffect, useState } from "react";
import {
  Shield,
  Play,
  Pause,
  Settings,
  FileText,
  Code,
  Send,
  BarChart3,
  X,
  Menu,
} from "lucide-react";
import Overview from "./Overview";
import Configuration from "./Configuration";
import AIPrompts from "./AIPrompts";
import Reports from "./Reports";
import { NAV_ITEMS } from "./constant";

const IconMap = {
  BarChart3,
  Settings,
  FileText,
  Code,
};

const SecurityIntelligenceDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCountries, setSelectedCountries] = useState([
    "Pakistan",
    "Sudan",
  ]);
  const [selectedOrgs, setSelectedOrgs] = useState(["AKDN"]);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleGenerateReport = () => {
    if (activeTab === "configuration") {
      document.dispatchEvent(new CustomEvent("generate-report"));
    }
  };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            onReportSelect={(r) => {
              setSelectedReport(r);
              setActiveTab("reports");
            }}
          />
        );
      case "configuration":
        return (
          <Configuration
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
            selectedOrgs={selectedOrgs}
            setSelectedOrgs={setSelectedOrgs}
            onReportGenerated={(data) => {
              setReportData(data);
              setActiveTab("reports");
            }}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case "prompts":
        return <AIPrompts />;
      case "reports":
        return (
          <Reports
            selectedReport={selectedReport}
            onReportSelect={(r) => {
              setSelectedReport(r);
              setActiveTab("reports");
            }}
          />
        );
      default:
        return <Overview />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Toggle Button */}
      {windowWidth < 768 && (
        <button
          className="mobile-toggle-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X size={24} className="icon-white" />
          ) : (
            <Menu size={24} className="icon-white" />
          )}
        </button>
      )}

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${
          isSidebarOpen || windowWidth >= 768 ? "open" : "closed"
        }`}
      >
        <div className="sidebar-header">
          <Shield size={32} color="white" />
          <div>
            <h1 className="sidebar-title">SecIntel AI</h1>
            <p className="sidebar-subtitle">Automated Reports</p>
          </div>
        </div>

        <nav className="nav-space">
          {NAV_ITEMS.map((item) => {
            const Icon = IconMap[item.icon];
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`nav-button ${
                  activeTab === item.id ? "active" : ""
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="agent-status-container">
          <div className="agent-status-box">
            <div className="agent-status-header">
              <span className="agent-status-text">Agent Status</span>
              <div
                className={`agent-status-indicator ${
                  isAgentRunning ? "active" : ""
                }`}
              ></div>
            </div>
            <button
              onClick={() => setIsAgentRunning(!isAgentRunning)}
              className={`agent-toggle-button ${
                isAgentRunning ? "stop" : "start"
              }`}
            >
              {isAgentRunning ? (
                <>
                  <Pause size={16} />
                  <span>Stop Agent</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Start Agent</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h2>
            {activeTab === "configuration"
              ? "System Configuration"
              : "Dashboard"}
          </h2>
          {activeTab === "configuration" && (
            <button
              className="generate-btn"
              onClick={handleGenerateReport}
              disabled={loading}
            >
              <Send size={16} />
              {loading ? "Generating..." : "Generate Report"}
            </button>
          )}
        </header>
        <main>{renderTabContent()}</main>
      </div>
    </div>
  );
};

export default SecurityIntelligenceDashboard;
