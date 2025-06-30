import React, { useRef } from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

const PAGE_HEIGHT = 1123; // px for A4
const PAGE_WIDTH = 794;

function estimateSectionHeight(section: React.ReactNode, baseHeight = 120) {
  // Simple estimate: header 120, summary 80, each exp/edu 90, skills 80
  // In real app, use refs/measurements or a lib like react-pdf for accuracy
  if (!section) return 0;
  if (Array.isArray(section)) return section.length * baseHeight;
  return baseHeight;
}

export default function ClassicHtml({ data }: { data: FormData }) {
  const template = getTemplateById('classic')!;
  const { styling, fonts } = template;
  const fontSize = 14;
  const sectionTitleFontSize = 18;
  const headerFontSize = 32;
  const jobFontSize = 15;
  const navyBlue = styling.primaryColor;
  const mediumGray = styling.secondaryColor;
  const sectionTitleStyle = {
    fontSize: sectionTitleFontSize,
    fontWeight: 700,
    color: navyBlue,
    margin: '32px 0 12px 0',
    borderBottom: `2px solid ${navyBlue}`,
    paddingBottom: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  };

  // Prepare sections as arrays of React nodes
  const sections = [];
  // Header
  sections.push(
    <div key="header" style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: headerFontSize, fontWeight: 700, margin: 0, color: navyBlue, marginBottom: 4 }}>{data.name}</h1>
      {data.jobTitle && (
        <h2 style={{ fontSize: jobFontSize, fontWeight: 400, margin: 0, color: mediumGray, marginBottom: 8 }}>{data.jobTitle}</h2>
      )}
      <div style={{ fontSize, color: mediumGray, display: 'flex', alignItems: 'center', gap: '8px' }}>
        {data.phone && <span>{data.phone}</span>}
        {data.phone && data.email && <span>•</span>}
        {data.email && <span>{data.email}</span>}
        {(data.phone || data.email) && data.location && <span>•</span>}
        {data.location && <span>{data.location}</span>}
      </div>
    </div>
  );
  // Summary
  if (data.personalSummary) {
    sections.push(
      <div key="summary">
        <div style={sectionTitleStyle}>Summary</div>
        <p style={{ margin: 0 }}>{data.personalSummary}</p>
      </div>
    );
  }
  // Experience
  if (data.workExperience && data.workExperience.length > 0) {
    sections.push(
      <div key="experience">
        <div style={sectionTitleStyle}>Professional Experience</div>
        {data.workExperience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
              <div style={{ fontWeight: 600, fontSize: jobFontSize, color: navyBlue }}>{exp.company}</div>
              <div style={{ fontSize: fontSize - 1, color: mediumGray, fontStyle: 'italic' }}>{exp.startMonth} {exp.startYear} – {exp.endMonth} {exp.endYear}</div>
            </div>
            <div style={{ fontSize: jobFontSize, fontWeight: 600, marginBottom: 8, color: '#333' }}>{exp.title}</div>
            <div style={{ fontSize }}>
              {exp.description.split('.').filter(item => item.trim()).map((bullet, idx) => (
                <div key={idx} style={{ marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, top: 0 }}>•</span>
                  {bullet.trim()}.
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  // Education
  if (data.education && data.education.length > 0) {
    sections.push(
      <div key="education">
        <div style={sectionTitleStyle}>Education</div>
        {data.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: jobFontSize, color: navyBlue, marginBottom: 2 }}>{edu.degree}</div>
                <div style={{ fontSize, color: '#333' }}>{edu.school}</div>
              </div>
              <div style={{ fontSize: fontSize - 1, color: mediumGray, fontStyle: 'italic' }}>{edu.endMonth} {edu.endYear}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  // Skills
  if (data.skills) {
    sections.push(
      <div key="skills">
        <div style={sectionTitleStyle}>Skills</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 8 }}>
          {data.skills.split(',').map((skill, i) => (
            <div key={i} style={{ marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              {skill.trim()}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Pagination logic
  let pages: React.ReactNode[][] = [[]];
  let currentHeight = 0;
  sections.forEach((section, idx) => {
    const estHeight = estimateSectionHeight(section, idx === 0 ? 140 : 120);
    if (currentHeight + estHeight > PAGE_HEIGHT - 96 && pages[pages.length - 1].length > 0) {
      // Start new page if this section would overflow
      pages.push([section]);
      currentHeight = estHeight;
    } else {
      pages[pages.length - 1].push(section);
      currentHeight += estHeight;
    }
  });

  return (
    <>
      {pages.map((sections, i) => (
        <div
          className="resume-page"
          key={i}
          style={{
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
            boxSizing: 'border-box',
            overflow: 'hidden',
            fontFamily: fonts.body,
            padding: 48,
            maxWidth: PAGE_WIDTH,
            margin: '0 auto',
            background: 'white',
            color: '#333',
            fontSize,
            lineHeight: 1.5,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {sections}
        </div>
      ))}
    </>
  );
}