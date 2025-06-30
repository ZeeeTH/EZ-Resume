import React from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

const PAGE_HEIGHT = 1123;
const PAGE_WIDTH = 794;

function estimateSectionHeight(section: React.ReactNode, baseHeight = 120) {
  if (!section) return 0;
  if (Array.isArray(section)) return section.length * baseHeight;
  return baseHeight;
}

export default function StructuredHtml({ data }: { data: FormData }) {
  const template = getTemplateById('structured')!;
  const { styling, fonts } = template;
  const fontSize = 14;
  const sectionTitleFontSize = 20;
  const headerFontSize = 36;
  const jobFontSize = 16;
  const sectionTitleStyle = {
    fontSize: sectionTitleFontSize,
    fontWeight: 700,
    color: styling.primaryColor,
    margin: '32px 0 16px 0',
    borderBottom: `3px solid ${styling.primaryColor}`,
    paddingBottom: 8,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    fontFamily: fonts.section,
  };

  // Prepare sections as arrays of React nodes
  const sections = [];
  // Header
  sections.push(
    <div key="header" style={{ textAlign: 'center', marginBottom: 32, borderBottom: `2px solid ${styling.primaryColor}`, paddingBottom: 24 }}>
      <h1 style={{ fontSize: headerFontSize, fontWeight: 700, margin: 0, color: styling.primaryColor, marginBottom: 8, fontFamily: fonts.header }}>{data.name}</h1>
      {data.jobTitle && (
        <h2 style={{ fontSize: jobFontSize, fontWeight: 400, margin: 0, color: styling.primaryColor, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>{data.jobTitle}</h2>
      )}
      <div style={{ width: '100%', height: 1, backgroundColor: styling.primaryColor, margin: '16px 0', opacity: 0.5 }} />
      <div style={{ fontSize, color: styling.primaryColor, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
      <div key="summary" style={{ marginBottom: 32, textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: fontSize + 1, lineHeight: 1.6, color: '#333', fontStyle: 'italic', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>{data.personalSummary}</p>
      </div>
    );
  }
  // Experience
  if (data.workExperience && data.workExperience.length > 0) {
    sections.push(
      <div key="experience" style={{ marginBottom: 32 }}>
        <div style={sectionTitleStyle}>Professional Experience</div>
        {data.workExperience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: jobFontSize + 1, color: styling.primaryColor, textTransform: 'uppercase', marginBottom: 4 }}>{exp.company}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <div style={{ fontSize: jobFontSize, fontWeight: 600, color: '#333' }}>{exp.title}</div>
              <div style={{ fontSize: fontSize - 1, color: '#666', fontStyle: 'italic' }}>{exp.startMonth} {exp.startYear} – {exp.endMonth} {exp.endYear}</div>
            </div>
            <div style={{ fontSize }}>
              {exp.description.split('.').filter(item => item.trim()).map((bullet, idx) => (
                <div key={idx} style={{ marginBottom: 3, paddingLeft: 16, position: 'relative', lineHeight: 1.5 }}>
                  <span style={{ position: 'absolute', left: 0, top: 0, color: '#333' }}>•</span>
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
      <div key="education" style={{ marginBottom: 32 }}>
        <div style={sectionTitleStyle}>Education</div>
        {data.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
              <div style={{ fontWeight: 700, fontSize: jobFontSize + 1, color: styling.primaryColor, textTransform: 'uppercase' }}>{edu.degree}</div>
              <div style={{ fontSize: fontSize - 1, color: '#666', fontStyle: 'italic' }}>{edu.endMonth} {edu.endYear}</div>
            </div>
            <div style={{ fontSize, color: '#333' }}>{edu.school}</div>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
          {data.skills.split(',').map((skill, i) => (
            <div key={i} style={{ marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: styling.primaryColor }}>•</span>
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