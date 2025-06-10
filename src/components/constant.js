export const countries = [
    'Afghanistan', 'Pakistan', 'Sudan', 'South Sudan', 'Syria', 'Yemen',
    'Somalia', 'Nigeria', 'Mali', 'Burkina Faso', 'Niger', 'Mozambique',
    'Ethiopia', 'Kenya', 'Libya', 'Iraq', 'Myanmar', 'Philippines',
    'Colombia', 'Venezuela', 'Haiti', 'DRC', 'CAR', 'Chad'
  ];

 export const organizations = [
    'AKDN', 'Islamic Relief', 'Oxfam', 'Save the Children', 'CARE',
    'World Vision', 'MSF', 'IRC', 'Mercy Corps', 'Action Against Hunger'
  ];

 export const dataSources = [
    { name: 'ReliefWeb RSS', status: 'active', lastSync: '5 min ago' },
    { name: 'Google News', status: 'active', lastSync: '10 min ago' },
  ];

 export  const allReports = [
    { 
      id: 1, 
      country: 'Pakistan', 
      org: 'AKDN', 
      date: '2025-05-28', 
      status: 'sent', 
      incidents: 12,
      severity: 'medium',
      keyFindings: ['Increased activity in northern regions', 'Supply route disruptions', 'Community tensions rising'],
      recipients: ['security@akdn.org', 'operations@akdn.org']
    },
    { 
      id: 2, 
      country: 'Sudan', 
      org: 'Islamic Relief', 
      date: '2025-05-27', 
      status: 'sent', 
      incidents: 18,
      severity: 'high',
      keyFindings: ['Civil unrest in capital', 'Aid convoy attacks', 'Border closures affecting operations'],
      recipients: ['response@islamic-relief.org']
    },
    { 
      id: 3, 
      country: 'Yemen', 
      org: 'Oxfam', 
      date: '2025-05-26', 
      status: 'draft', 
      incidents: 23,
      severity: 'critical',
      keyFindings: ['Escalation in conflict zones', 'Humanitarian access severely limited', 'Critical infrastructure damaged'],
      recipients: ['yemen-team@oxfam.org']
    },
    { 
      id: 4, 
      country: 'Somalia', 
      org: 'CARE', 
      date: '2025-05-25', 
      status: 'sent', 
      incidents: 15,
      severity: 'high',
      keyFindings: ['IED threats on main roads', 'Clan conflicts affecting operations', 'Weather-related challenges'],
      recipients: ['somalia@care.org', 'security@care.org']
    },
    {
      id: 5,
      country: 'Afghanistan',
      org: 'Save the Children',
      date: '2025-05-24',
      status: 'reviewing',
      incidents: 21,
      severity: 'high',
      keyFindings: ['Movement restrictions for female staff', 'Economic crisis deepening', 'Winter preparedness concerns'],
      recipients: ['afghanistan@savethechildren.org']
    }
  ];

  export const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'configuration', label: 'Configuration', icon: 'Settings' },
    { id: 'reports', label: 'Reports', icon: 'FileText' },
    // { id: 'prompts', label: 'AI Prompts', icon: 'Code' }
  ];
  
  export const PROMPT_TEMPLATES = [
    {
      id: 1,
      name: 'Security Analysis',
      type: 'main',
      template: `You are a security analyst for [Organization]. Based on the following incidents in [Country], generate a report for the past 8 days. Focus on risks to humanitarian or development operations.
  
  Analyze the following aspects:
  1. Immediate security threats
  2. Operational impact on humanitarian activities
  3. Access constraints and movement restrictions
  4. Risk mitigation recommendations`,
      variables: ['Organization', 'Country'],
      active: true
    },
    {
      id: 2,
      name: 'Trend Analysis',
      type: 'section',
      template: `Identify emerging security trends based on the incidents. Consider:
  - Pattern recognition across incidents
  - Escalation or de-escalation indicators
  - Geographic spread of incidents
  - Actor behavior changes`,
      variables: [],
      active: true
    },
    {
      id: 3,
      name: 'Strategic Outlook',
      type: 'section',
      template: `Provide strategic recommendations for [Organization] operations in [Country]. Consider both short-term tactical adjustments and long-term strategic positioning.`,
      variables: ['Organization', 'Country'],
      active: true
    }
  ];
  
  export const PROMPT_GUIDELINES = [
    'Use clear, specific instructions for better AI responses',
    'Include context about the organization and region',
    'Specify the desired output format and length',
    'Use variables for dynamic content like [Organization] and [Country]'
  ];
  
  export const REPORT_FILTERS = [
    { value: 'all', label: 'All Reports' },
    { value: 'sent', label: 'Sent' },
    { value: 'draft', label: 'Drafts' },
    { value: 'reviewing', label: 'Under Review' }
  ];
  
  export const SCHEDULE_OPTIONS = [
    'Weekly (Every Monday)',
  ];
  
  export const OUTPUT_FORMATS = [
    'PDF',
    'Google Docs',
    'HTML Email',
    'Markdown'
  ]; 