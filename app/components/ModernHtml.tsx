import React from 'react';
import modernTemplate from '../../data/templates/modern.json';
import { FormData } from '../../types';

export default function ModernHtml({ data }: { data: FormData }) {
  const { styling } = modernTemplate;
  const sectionTitleStyle = {
    fontSize: 20,
    fontWeight: 700,
    color: styling.primaryColor,
    margin: '40px 0 16px 0',
    borderBottom: `2px solid ${styling.secondaryColor}`,
    paddingBottom: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  };
  const labelStyle = { color: styling.secondaryColor, fontWeight: 400 };
  return (
    <div style={{ fontFamily: styling.fontFamily, padding: 48, maxWidth: 800, margin: '0 auto', background: 'white', color: styling.primaryColor, fontSize: 16 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, color: styling.primaryColor, letterSpacing: 1 }}>{data.name}</h1>
        {data.jobTitle && <h2 style={{ fontSize: 22, fontWeight: 400, margin: '4px 0 0 0', color: styling.secondaryColor }}>{data.jobTitle}</h2>}
        <div style={{ margin: '12px 0', fontSize: 16, color: styling.secondaryColor }}>
          {data.phone && <span>{data.phone}</span>}
          {data.phone && data.email && <span> • </span>}
          {data.email && <span>{data.email}</span>}
          {(data.phone || data.email) && data.location && <span> • </span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>
      {/* Summary */}
      {data.personalSummary && (
        <div style={{ margin: '24px 0 0 0' }}>
          <div style={sectionTitleStyle}>Summary</div>
          <p style={{ fontStyle: 'italic', color: styling.secondaryColor, margin: 0 }}>{data.personalSummary}</p>
        </div>
      )}
      {/* Skills */}
      {data.skills && (
        <div style={{ marginTop: 32 }}>
          <div style={sectionTitleStyle}>Skills</div>
          <ul style={{
            columns: 2,
            fontSize: 16,
            margin: '0 auto',
            padding: 0,
            listStyle: 'disc inside',
            maxWidth: 600,
            textAlign: 'left',
          }}>
            {data.skills.split(',').map((skill, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{skill.trim()}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Achievements */}
      {data.achievements && (
        <div style={{ marginTop: 32 }}>
          <div style={sectionTitleStyle}>Key Achievements</div>
          <p style={{ fontSize: 16, margin: 0 }}>{data.achievements}</p>
        </div>
      )}
      {/* Work Experience */}
      {data.workExperience && data.workExperience.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={sectionTitleStyle}>Work Experience</div>
          {data.workExperience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 24, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
              <div style={{ fontWeight: 600, fontSize: 17 }}>{exp.title} <span style={labelStyle}>@ {exp.company}</span></div>
              <div style={{ fontSize: 14, color: styling.secondaryColor, marginBottom: 2 }}>
                {exp.startMonth} {exp.startYear} - {exp.endMonth} {exp.endYear}
              </div>
              <div style={{ fontSize: 16 }}>{exp.description}</div>
            </div>
          ))}
        </div>
      )}
      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={sectionTitleStyle}>Education</div>
          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 20, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
              <div style={{ fontWeight: 600, fontSize: 17 }}>{edu.degree} <span style={labelStyle}>@ {edu.school}</span></div>
              <div style={{ fontSize: 14, color: styling.secondaryColor, marginBottom: 2 }}>
                {edu.startMonth} {edu.startYear} - {edu.endMonth} {edu.endYear}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 