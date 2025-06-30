import React from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

export default function ClassicHtml({ data }: { data: FormData }) {
  const template = getTemplateById('classic')!;
  const { styling, fonts } = template;

  // Normalize work experience - only use user data
  const workExperience = data.workExperience?.length
    ? data.workExperience.map(job => ({
        company: job.company,
        title: job.title,
        dates: job.startMonth && job.startYear && job.endMonth && job.endYear
          ? `${job.startMonth} ${job.startYear} – ${job.endMonth} ${job.endYear}`
          : '',
        bullets: job.description
          ? job.description.split('.').filter(Boolean).map(s => s.trim() + '.')
          : [],
      }))
    : [];

  // Normalize education - only use user data
  const education = data.education?.length
    ? data.education.map(edu => ({
        degree: edu.degree,
        institution: edu.school,
        dates: edu.endMonth && edu.endYear ? `${edu.endMonth} ${edu.endYear}` : '',
      }))
    : [];

  // Normalize skills - only use user data
  const skills = data.skills
    ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  // Only use user data, no fallbacks to sample data
  const name = data.name || '';
  const jobTitle = data.jobTitle || '';
  const phone = data.phone || '';
  const email = data.email || '';
  const location = data.location || '';
  const summary = data.personalSummary || '';

  const sectionTitleStyle = {
    fontSize: 18,
    fontWeight: 700,
    color: styling.primaryColor,
    margin: '32px 0 12px 0',
    borderBottom: `2px solid ${styling.primaryColor}`,
    paddingBottom: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    fontFamily: fonts.section,
  };

  return (
    <div style={{
      fontFamily: fonts.body,
      padding: 48,
      maxWidth: 750,
      margin: '0 auto',
      background: 'white',
      color: '#333',
      fontSize: 14,
      lineHeight: 1.5
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          margin: 0,
          color: styling.primaryColor,
          marginBottom: 4,
          fontFamily: fonts.header
        }}>{name}</h1>
        <h2 style={{
          fontSize: 18,
          fontWeight: 400,
          margin: 0,
          color: styling.secondaryColor,
          marginBottom: 8
        }}>{jobTitle}</h2>
        <div style={{
          fontSize: 14,
          color: styling.secondaryColor,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {phone && <span>{phone}</span>}
          {phone && email && <span>•</span>}
          {email && <span>{email}</span>}
          {(phone || email) && location && <span>•</span>}
          {location && <span>{location}</span>}
        </div>
      </div>
      {/* Summary */}
      {summary && (
        <div>
          <div style={sectionTitleStyle}>Summary</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{summary}</p>
        </div>
      )}
      {/* Professional Experience */}
      {workExperience && workExperience.length > 0 && (
        <div>
          <div style={sectionTitleStyle}>Professional Experience</div>
          {workExperience.map((job, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: styling.primaryColor }}>{job.company}</div>
                <div style={{ fontSize: 14, color: styling.secondaryColor, fontStyle: 'italic' }}>{job.dates}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#333' }}>{job.title}</div>
              <div style={{ fontSize: 14 }}>
                {job.bullets.map((bullet, idx) => (
                  <div key={idx} style={{ marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, top: 0 }}>•</span>
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Education */}
      {education && education.length > 0 && (
        <div>
          <div style={sectionTitleStyle}>Education</div>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: styling.primaryColor, marginBottom: 2 }}>{edu.degree}</div>
                  <div style={{ fontSize: 14, color: '#333' }}>{edu.institution}</div>
                </div>
                <div style={{ fontSize: 14, color: styling.secondaryColor, fontStyle: 'italic' }}>{edu.dates}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Skills */}
      {skills && skills.length > 0 && (
        <div>
          <div style={sectionTitleStyle}>Skills</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 16 }}>
            {skills.map((skill, i) => (
              <div key={i} style={{ marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}