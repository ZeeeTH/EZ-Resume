// Industry-specific skills database organized by experience level
export const industrySkills = {
  technology: {
    entry: [
      // Programming Languages
      'JavaScript', 'Python', 'Java', 'HTML/CSS', 'SQL', 'C++', 'React', 'Node.js',
      // Tools & Platforms
      'Git', 'VS Code', 'GitHub', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL',
      // Soft Skills
      'Problem Solving', 'Debugging', 'Code Review', 'Agile Methodology', 'Team Collaboration',
      // Learning & Development
      'Self-Learning', 'Technical Documentation', 'Testing', 'Version Control',
      // Additional Technical
      'JSON', 'REST APIs', 'Bootstrap', 'jQuery', 'Linux', 'Responsive Design'
    ],
    mid: [
      // Advanced Technologies
      'Microservices', 'Kubernetes', 'CI/CD', 'REST APIs', 'GraphQL', 'Redux', 'TypeScript',
      // Architecture & Design
      'System Design', 'Database Design', 'Software Architecture', 'Design Patterns',
      // Leadership & Process
      'Code Review Leadership', 'Mentoring', 'Project Management', 'Technical Leadership',
      // Specialized Skills
      'Performance Optimization', 'Security Best Practices', 'Scalability', 'DevOps',
      // Advanced Tools
      'Jenkins', 'Terraform', 'Redis', 'Elasticsearch', 'Apache Kafka', 'RabbitMQ'
    ],
    senior: [
      // Strategic & Leadership
      'Technical Strategy', 'Team Leadership', 'Architecture Design', 'Technology Roadmap',
      // Business & Communication
      'Stakeholder Management', 'Technical Communication', 'Budget Management', 'Vendor Management',
      // Advanced Technical
      'Enterprise Architecture', 'Cloud Strategy', 'Security Architecture', 'Performance Engineering',
      // Industry Expertise
      'Technology Innovation', 'Digital Transformation', 'Technical Due Diligence', 'Open Source Contribution',
      // Executive Skills
      'CTO Leadership', 'Technology Vision', 'Cross-functional Leadership', 'Technical Recruiting'
    ]
  },
  
  healthcare: {
    entry: [
      // Clinical Skills
      'Patient Care', 'Vital Signs', 'Medical Documentation', 'HIPAA Compliance', 'Infection Control',
      // Technical Skills
      'Electronic Health Records', 'Medical Terminology', 'Clinical Procedures', 'Patient Assessment',
      // Soft Skills
      'Empathy', 'Communication', 'Attention to Detail', 'Time Management', 'Team Collaboration',
      // Certifications
      'CPR Certification', 'First Aid', 'Basic Life Support', 'AHPRA Registration',
      // Australian Healthcare
      'Medicare Knowledge', 'Patient Privacy', 'Clinical Governance', 'Safety Protocols'
    ],
    mid: [
      // Advanced Clinical
      'Clinical Decision Making', 'Patient Education', 'Care Coordination', 'Quality Improvement',
      // Specialized Skills
      'Chronic Disease Management', 'Medication Administration', 'Clinical Research', 'Evidence-Based Practice',
      // Leadership
      'Mentoring', 'Training', 'Protocol Development', 'Interdisciplinary Collaboration',
      // Technology
      'Health Information Systems', 'Telehealth', 'Clinical Analytics', 'Digital Health',
      // Australian Standards
      'NSQHS Standards', 'Clinical Audit', 'Accreditation', 'Risk Management'
    ],
    senior: [
      // Leadership & Management
      'Healthcare Leadership', 'Staff Management', 'Budget Management', 'Strategic Planning',
      // Clinical Expertise
      'Clinical Excellence', 'Quality Assurance', 'Risk Management', 'Regulatory Compliance',
      // Innovation & Development
      'Process Improvement', 'Clinical Research Leadership', 'Policy Development', 'Healthcare Innovation',
      // Business Skills
      'Healthcare Economics', 'Performance Metrics', 'Change Management', 'Stakeholder Engagement',
      // Executive Healthcare
      'Health System Leadership', 'Board Governance', 'Public Health Policy', 'Healthcare Reform'
    ]
  },
  
  finance: {
    entry: [
      // Core Finance
      'Financial Analysis', 'Excel', 'Accounting Principles', 'Financial Modeling', 'Budgeting',
      // Software & Tools
      'QuickBooks', 'SAP', 'Bloomberg Terminal', 'Financial Reporting', 'Data Analysis',
      // Regulatory & Compliance
      'GAAP', 'Tax Preparation', 'Audit Support', 'Compliance', 'Risk Assessment',
      // Soft Skills
      'Attention to Detail', 'Analytical Thinking', 'Problem Solving', 'Communication',
      // Australian Finance
      'AASB Standards', 'ASIC Compliance', 'Superannuation', 'GST', 'FBT'
    ],
    mid: [
      // Advanced Analysis
      'Investment Analysis', 'Portfolio Management', 'Risk Management', 'Derivatives', 'Valuation',
      // Management & Strategy
      'Financial Planning', 'Strategic Analysis', 'M&A Analysis', 'Capital Structure', 'Cash Flow Management',
      // Technology & Tools
      'Advanced Excel', 'Python/R', 'SQL', 'Financial Software', 'Trading Platforms',
      // Leadership
      'Team Leadership', 'Client Relations', 'Project Management', 'Training & Development',
      // Australian Markets
      'ASX Knowledge', 'APRA Regulations', 'Australian Banking', 'Wealth Management'
    ],
    senior: [
      // Executive Finance
      'Corporate Finance Strategy', 'Investment Strategy', 'Capital Markets', 'Financial Restructuring',
      // Leadership & Governance
      'Executive Leadership', 'Board Relations', 'Regulatory Relations', 'Stakeholder Management',
      // Strategic & Innovation
      'Digital Finance', 'FinTech Innovation', 'ESG Finance', 'International Finance',
      // Business Management
      'P&L Management', 'Business Development', 'Investor Relations', 'Corporate Governance',
      // Australian Executive
      'ASX Listing', 'AUSTRAC Compliance', 'Treasury Management', 'Banking Royal Commission'
    ]
  },
  
  marketing: {
    entry: [
      // Digital Marketing
      'Social Media Marketing', 'Content Creation', 'Email Marketing', 'SEO', 'Google Analytics',
      // Creative & Content
      'Copywriting', 'Graphic Design', 'Video Editing', 'Photography', 'Brand Guidelines',
      // Tools & Platforms
      'Facebook Ads', 'Instagram', 'LinkedIn', 'Canva', 'Mailchimp', 'WordPress',
      // Analysis & Research
      'Market Research', 'Campaign Analysis', 'A/B Testing', 'Customer Insights'
    ],
    mid: [
      // Advanced Digital
      'Paid Advertising', 'Marketing Automation', 'CRM Management', 'Lead Generation', 'Conversion Optimization',
      // Strategy & Planning
      'Marketing Strategy', 'Campaign Management', 'Brand Management', 'Product Marketing',
      // Analytics & Data
      'Google Ads', 'Facebook Business Manager', 'HubSpot', 'Salesforce', 'Marketing Analytics',
      // Leadership & Management
      'Team Management', 'Budget Management', 'Vendor Management', 'Cross-functional Collaboration'
    ],
    senior: [
      // Strategic Leadership
      'Marketing Strategy', 'Brand Strategy', 'Go-to-Market Strategy', 'Digital Transformation',
      // Business & Growth
      'Growth Marketing', 'Customer Acquisition', 'Revenue Marketing', 'Marketing ROI',
      // Leadership & Innovation
      'Team Leadership', 'Marketing Innovation', 'Agile Marketing', 'Marketing Technology',
      // Executive Skills
      'Executive Communication', 'Board Presentations', 'Stakeholder Management', 'P&L Responsibility'
    ]
  },

  engineering: {
    entry: [
      // Core Engineering
      'CAD Software', 'Technical Drawing', 'Project Management', 'Quality Control', 'Safety Protocols',
      // Technical Skills
      'AutoCAD', 'SolidWorks', 'MATLAB', 'Problem Solving', 'Data Analysis',
      // Soft Skills
      'Team Collaboration', 'Communication', 'Attention to Detail', 'Time Management',
      // Australian Standards
      'Australian Standards', 'WHS Compliance', 'Engineers Australia', 'CPEng Pathway'
    ],
    mid: [
      // Advanced Technical
      'Systems Engineering', 'Process Optimization', 'Risk Assessment', 'Technical Leadership',
      // Management
      'Project Leadership', 'Budget Management', 'Team Management', 'Stakeholder Communication',
      // Specialized
      'Lean Manufacturing', 'Six Sigma', 'ISO Standards', 'Continuous Improvement',
      // Australian Engineering
      'AS/NZS Standards', 'Building Code Australia', 'Professional Engineer', 'RPEQ'
    ],
    senior: [
      // Strategic Engineering
      'Engineering Strategy', 'Innovation Management', 'Technology Roadmap', 'R&D Leadership',
      // Executive Skills
      'Executive Leadership', 'Board Relations', 'Strategic Planning', 'Business Development',
      // Industry Leadership
      'Engineering Excellence', 'Professional Development', 'Industry Standards', 'Regulatory Affairs',
      // Australian Leadership
      'Infrastructure Development', 'Government Relations', 'Industry Transformation', 'Sustainability Leadership'
    ]
  },

  education: {
    entry: [
      // Teaching Skills
      'Lesson Planning', 'Classroom Management', 'Student Assessment', 'Curriculum Development',
      // Technology
      'Educational Technology', 'Online Learning', 'Google Classroom', 'Microsoft Teams',
      // Communication
      'Parent Communication', 'Student Engagement', 'Differentiated Instruction', 'Collaborative Learning',
      // Australian Education
      'Australian Curriculum', 'ACARA Standards', 'NAPLAN', 'Teaching Standards'
    ],
    mid: [
      // Advanced Teaching
      'Curriculum Leadership', 'Professional Learning', 'Mentoring', 'Data Analysis',
      // Leadership
      'Team Leadership', 'Department Management', 'Professional Development', 'Policy Implementation',
      // Specialized
      'Special Needs Education', 'Literacy/Numeracy', 'Student Wellbeing', 'Assessment Design',
      // Australian Leadership
      'AITSL Standards', 'School Improvement', 'Professional Learning Communities', 'NAPLAN Analysis'
    ],
    senior: [
      // Educational Leadership
      'School Leadership', 'Strategic Planning', 'Staff Management', 'Budget Management',
      // System Leadership
      'Policy Development', 'Curriculum Strategy', 'School Improvement', 'Change Management',
      // Executive Education
      'Educational Innovation', 'Community Engagement', 'Government Relations', 'Board Governance',
      // Australian Executive
      'Department of Education', 'School Council', 'ACARA Leadership', 'Educational Reform'
    ]
  }
};

// Universal professional skills that apply to all industries
export const universalSkills = [
  'Communication', 'Leadership', 'Problem Solving', 'Time Management', 
  'Adaptability', 'Critical Thinking', 'Teamwork', 'Organization',
  'Customer Service', 'Public Speaking', 'Project Management', 'Research',
  'Writing', 'Presentation Skills', 'Negotiation', 'Conflict Resolution'
];

// Get skills for a specific industry and experience level
export const getSkillsForIndustryAndLevel = (industry: string, experienceLevel: string): string[] => {
  if (!industry || !experienceLevel) {
    return []; // Return empty if no selection made
  }
  
  const industrySkillSet = industrySkills[industry as keyof typeof industrySkills];
  if (!industrySkillSet) {
    return universalSkills; // Fallback to universal skills for unknown industry
  }
  
  const levelSkills = industrySkillSet[experienceLevel as keyof typeof industrySkillSet] || [];
  
  // Combine industry-specific skills with some universal skills
  const relevantUniversalSkills = universalSkills.slice(0, 8); // First 8 universal skills
  
  // Return combined list, removing duplicates
  const allSkills = [...levelSkills, ...relevantUniversalSkills];
  const uniqueSkills: string[] = [];
  allSkills.forEach(skill => {
    if (!uniqueSkills.includes(skill)) {
      uniqueSkills.push(skill);
    }
  });
  return uniqueSkills;
};

 