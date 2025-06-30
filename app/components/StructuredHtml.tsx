import React from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

export default function StructuredHtml({ data }: { data: FormData }) {
  const template = getTemplateById('structured')!;
  const { styling, fonts } = template;
  
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
          {data.name}
        </h1>
        {data.jobTitle && (
          <h2 style={{ 
            fontSize: 16, 
            fontWeight: 400, 
            margin: 0, 
            color: styling.primaryColor,
            textTransform: 'uppercase',
            letterSpacing: 3,
            marginBottom: 16
          }}>
            {data.jobTitle}
          </h2>
        )}
        
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
          {data.phone && <span>{data.phone}</span>}
          {data.phone && data.email && <span>•</span>}
          {data.email && <span>{data.email}</span>}
          {(data.phone || data.email) && data.location && <span>•</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personalSummary && (
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
            {data.personalSummary}
          </p>
        </div>
      )}

      {/* Professional Experience */}
      {data.workExperience && data.workExperience.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={sectionTitleStyle}>Professional Experience</div>
          {data.workExperience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 32 }}>
              {/* Company Name */}
              <div style={{ 
                fontWeight: 700, 
                fontSize: 16, 
                color: styling.primaryColor,
                textTransform: 'uppercase',
                marginBottom: 4
              }}>
                {exp.company}
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
                  {exp.title}
                </div>
                <div style={{ 
                  fontSize: 14, 
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  {exp.startMonth} {exp.startYear} – {exp.endMonth} {exp.endYear}
                </div>
              </div>
              
              {/* Description as bullet points */}
              <div style={{ fontSize: 14, color: '#333' }}>
                {exp.description.split('.').filter(item => item.trim()).map((bullet, idx) => (
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
                    {bullet.trim()}.
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={sectionTitleStyle}>Education</div>
          {data.education.map((edu, i) => (
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
                  {edu.endMonth} {edu.endYear}
                </div>
              </div>
              <div style={{ 
                fontSize: 15, 
                color: '#333' 
              }}>
                {edu.school}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && (
        <div>
          <div style={sectionTitleStyle}>Skills</div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: 40,
            marginBottom: 16
          }}>
            {/* Left Column */}
            <div>
              <div style={{ fontSize: 14 }}>
                <div style={{ marginBottom: 6, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>■</span>
                  Molecular Cloning
                </div>
                <div style={{ marginBottom: 6, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>■</span>
                  CRISPR
                </div>
                <div style={{ marginBottom: 6, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>■</span>
                  Fluorescence Microscopy
                </div>
                <div style={{ marginBottom: 6, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>■</span>
                  Fluent in English and Hindi
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <div style={{ fontSize: 14 }}>
                <div style={{ marginBottom: 6, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>■</span>
                  Curriculum Development
                </div>
                <div style={{ marginBottom: 6, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>■</span>
                  Academic Advising
                </div>
                <div style={{ marginBottom: 6, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>■</span>
                  Public Speaking
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}