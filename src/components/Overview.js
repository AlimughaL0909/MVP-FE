import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Globe, Activity, Clock, Database, Eye, TrendingUp } from 'lucide-react';
import { allReports, dataSources } from '../components/constant';

const StatCard = React.memo(({ icon: Icon, title, value, trend, color }) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <div className="stat-icon" style={{ background: color }}>
        <Icon size={24} color="white" />
      </div>
      {trend && (
        <span className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
          <TrendingUp size={16} style={{ transform: trend < 0 ? 'rotate(180deg)' : 'none' }} />
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h3 className="stat-label">{title}</h3>
    <p className="stat-value">{value}</p>
  </div>
));

const Overview = ({ onReportSelect }) => {
  const [animatedStats, setAnimatedStats] = useState({
    reports: 0,
    incidents: 0,
    countries: 0,
    uptime: 0
  });
const [recentReports, setRecentReports] = useState([]);
const [totalReports, setTotalReports] = useState(0);
const [totalCountries, setTotalCountries] = useState(0);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchRecentReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/recent-reports');
      if (!response.ok) throw new Error('Failed to fetch reports');
      
      const data = await response.json();
      setRecentReports(data.reports);
      setTotalReports(data.totalReports);
      setTotalCountries(data.totalCountries);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchRecentReports();
}, []); // Empty dependency array ensures the effect runs only once
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats(prev => ({
        reports: Math.min(prev.reports + 2, 156),
        incidents: Math.min(prev.incidents + 5, 1234),
        countries: Math.min(prev.countries + 1, 23),
        uptime: Math.min(prev.uptime + 0.5, 99.8)
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fadeIn">
      <div className="stat-grid">
        <StatCard 
          icon={FileText} 
          title="Total Reports" 
          value={totalReports} // Changed from animatedStats.reports
          trend={12} 
          color="linear-gradient(to right, #3b82f6, #2563eb)" 
        />
        {/* <StatCard 
          icon={AlertCircle} 
          title="Incidents Tracked" 
          value={animatedStats.incidents.toLocaleString()} 
          trend={-5} 
          color="linear-gradient(to right, #f97316, #ea580c)" 
        /> */}
        <StatCard 
          icon={Globe} 
          title="Countries Monitored" 
          value={totalCountries} 
          color="linear-gradient(to right, #10b981, #059669)" 
        />
        {/* <StatCard 
          icon={Activity} 
          title="System Uptime" 
          value={`${animatedStats.uptime.toFixed(1)}%`} 
          color="linear-gradient(to right, #8b5cf6, #7c3aed)" 
        /> */}
      </div>

      <div className="grid-2-col">
        <div className="content-card">
          <h3 className="content-card-header">
            <Clock size={20} className="icon-purple" />
            Recent Reports
          </h3>
          <div className="list-space">
            {recentReports?.map(report => (
              <div key={report.id} className="list-item">
                <div className="list-item-content">
                  <div className="status-dot active"></div>
                  <div>
                    <p className="list-item-text">{report.country}</p>
                    <p className="list-item-subtext">{report.organization}</p>
                  </div>
                </div>
                <div className="list-item-actions">
                  <span className="status-badge active">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => onReportSelect(report)}
                    className="hover-icon"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card">
          <h3 className="content-card-header">
            <Database size={20} className="icon-purple" />
            Data Sources
          </h3>
          <div className="list-space">
            {dataSources?.map((source, idx) => (
              <div key={idx} className="list-item">
                <div className="list-item-content">
                  <div className={`status-dot ${source.status}`}></div>
                  <div>
                    <p className="list-item-text">{source.name}</p>
                    <p className="list-item-subtext">Last sync: {source.lastSync}</p>
                  </div>
                </div>
                <span className={`status-badge ${source.status}`}>
                  {source.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Overview);