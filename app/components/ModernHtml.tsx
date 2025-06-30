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

export default function ModernHtml({ data }: { data: FormData }) {
  const template = getTemplateById('modern')!;
  const { styling, fonts } = template;
  const fontSize = 14;
  const sectionTitleFontSize = 18;
  const headerFontSize = 32;
  const jobFontSize = 15;
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

  // Sidebar content (repeated on each page)
  const sidebar = (
    <div style={{
      width: '32%',
      backgroundColor: styling.primaryColor,
      color: 'white',
      padding: '48px 32px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
    }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: headerFontSize, fontWeight: 700, margin: 0, lineHeight: 1.1, marginBottom: 12, fontFamily: fonts.header }}>{data.name}</h1>
        {data.jobTitle && (
          <h2 style={{ fontSize: jobFontSize, fontWeight: 400, margin: 0, textTransform: 'uppercase', letterSpacing: 2, opacity: 0.9 }}>{data.jobTitle}</h2>
        )}
        <div style={{ width: 60, height: 3, backgroundColor: 'white', margin: '16px 0' }} />
      </div>
      <div style={{ marginBottom: 32 }}>
        {data.phone && (<div style={{ marginBottom: 8, fontSize, opacity: 0.9 }}>{data.phone}</div>)}
        {data.email && (<div style={{ marginBottom: 8, fontSize, opacity: 0.9, wordBreak: 'break-word' }}>{data.email}</div>)}
        {data.location && (<div style={{ fontSize, opacity: 0.9 }}>{data.location}</div>)}
      </div>
    </div>
  );

  // Prepare main content sections
  const sections = [];
  if (data.personalSummary) {
    sections.push(
      <div key="summary" style={{ marginBottom: 32 }}>
        <div style={sectionTitleStyle}>Summary</div>
        <p style={{ margin: 0, fontSize: fontSize + 1, lineHeight: 1.6, color: '#333' }}>{data.personalSummary}</p>
      </div>
    );
  }
  if (data.workExperience && data.workExperience.length > 0) {
    sections.push(
      <div key="experience" style={{ marginBottom: 32 }}>
        <div style={sectionTitleStyle}>Professional Experience</div>
        {data.workExperience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
              <div style={{ fontWeight: 700, fontSize: jobFontSize + 1, color: styling.primaryColor }}>{exp.company}</div>
              <div style={{ fontSize: fontSize - 1, color: '#666', fontStyle: 'italic' }}>{exp.startMonth} {exp.startYear} – {exp.endMonth} {exp.endYear}</div>
            </div>
            <div style={{ fontSize: jobFontSize, fontWeight: 600, marginBottom: 6, color: '#333' }}>{exp.title}</div>
            <div style={{ fontSize }}>
              {exp.description.split('.').filter(item => item.trim()).map((bullet, idx) => (
                <div key={idx} style={{ marginBottom: 3, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, top: 0, color: styling.primaryColor, fontWeight: 'bold' }}>•</span>
                  {bullet.trim()}.
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (data.education && data.education.length > 0) {
    sections.push(
      <div key="education" style={{ marginBottom: 32 }}>
        <div style={sectionTitleStyle}>Education</div>
        {data.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
              <div style={{ fontWeight: 700, fontSize: jobFontSize + 1, color: styling.primaryColor }}>{edu.degree}</div>
              <div style={{ fontSize: fontSize - 1, color: '#666', fontStyle: 'italic' }}>{edu.endMonth} {edu.endYear}</div>
            </div>
            <div style={{ fontSize, color: '#333' }}>{edu.school}</div>
          </div>
        ))}
      </div>
    );
  }
  if (data.skills) {
    sections.push(
      <div key="skills">
        <div style={sectionTitleStyle}>Skills</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
          {data.skills.split(',').map((skill, i) => (
            <div key={i} style={{ marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: styling.primaryColor, fontWeight: 'bold' }}>•</span>
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
    const estHeight = estimateSectionHeight(section, 140);
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
            display: 'flex',
            background: 'white',
            fontSize,
            minHeight: PAGE_HEIGHT,
          }}
        >
          {sidebar}
          <div style={{ width: '68%', padding: '48px 40px', backgroundColor: 'white', overflow: 'hidden', minHeight: PAGE_HEIGHT }}>
            {sections}
          </div>
        </div>
      ))}
    </>
  );
}