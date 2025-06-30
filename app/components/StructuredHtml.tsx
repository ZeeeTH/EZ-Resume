import React from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

export default function StructuredHtml({ data }: { data: FormData }) {
  const template = getTemplateById('structured')!;
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
    fontSize: 20,
    fontWeight: 700,
    color: styling.primaryColor,
    margin: '32px 0 16px 0',
    borderBottom: `3px solid ${styling.primaryColor}`,
    paddingBottom: 8,
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
      <div style={{ 
        textAlign: 'center',
        marginBottom: 32,
        borderBottom: `2px solid ${styling.primaryColor}`,
        paddingBottom: 24
      }}>
        <h1 style={{ 
          fontSize: 36, 
          fontWeight: 700, 
          margin: 0, 
          color: styling.primaryColor,
          marginBottom: 8,
          fontFamily: fonts.header
        }}>
          {name}
        </h1>
        <h2 style={{ 
          fontSize: 16, 
          fontWeight: 400, 
          margin: 0, 
          color: styling.primaryColor,
          textTransform: 'uppercase',
          letterSpacing: 3,
          marginBottom: 16
        }}>
          {jobTitle}
        </h2>
        
        {/* Second border line */}
        <div style={{
          width: '100%',
          height: 1,
          backgroundColor: styling.primaryColor,
          margin: '16px 0',
          opacity: 0.5
        }} />
        
        <div style={{ 
          fontSize: 14, 
          color: styling.primaryColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
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
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <p style={{ 
            margin: 0, 
            fontSize: 15, 
            lineHeight: 1.6,
            color: '#333',
            fontStyle: 'italic',
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {summary}
          </p>
        </div>
      )}

      {/* Professional Experience */}
      {workExperience && workExperience.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={sectionTitleStyle}>Professional Experience</div>
          {workExperience.map((job, i) => (
            <div key={i} style={{ marginBottom: 32 }}>
              {/* Company Name */}
              <div style={{ 
                fontWeight: 700, 
                fontSize: 16, 
                color: styling.primaryColor,
                textTransform: 'uppercase',
                marginBottom: 4
              }}>
                {job.company}
              </div>
              
              {/* Position and Date */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 12
              }}>
                <div style={{ 
                  fontSize: 15, 
                  fontWeight: 600, 
                  color: '#333'
                }}>
                  {job.title}
                </div>
                <div style={{ 
                  fontSize: 14, 
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  {job.dates}
                </div>
              </div>
              
              {/* Bullets */}
              <div style={{ fontSize: 14, color: '#333' }}>
                {job.bullets.map((bullet, idx) => (
                  <div key={idx} style={{ 
                    marginBottom: 6,
                    paddingLeft: 16,
                    position: 'relative',
                    lineHeight: 1.5
                  }}>
                    <span style={{ 
                      position: 'absolute', 
                      left: 0, 
                      top: 0,
                      color: '#333'
                    }}>•</span>
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
        <div style={{ marginBottom: 40 }}>
          <div style={sectionTitleStyle}>Education</div>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 4
              }}>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: 16, 
                  color: styling.primaryColor,
                  textTransform: 'uppercase'
                }}>
                  {edu.degree}
                </div>
                <div style={{ 
                  fontSize: 14, 
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  {edu.dates}
                </div>
              </div>
              <div style={{ 
                fontSize: 15, 
                color: '#333' 
              }}>
                {edu.institution}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div>
          <div style={sectionTitleStyle}>Skills</div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 8
          }}>
            {skills.map((skill, i) => (
              <div key={i} style={{ marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: styling.primaryColor }}>•</span>
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}