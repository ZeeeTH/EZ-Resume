import React from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

export default function ClassicHtml({ data }: { data: FormData }) {
  const template = getTemplateById('classic')!;
  const { styling, fonts } = template;
  
  const navyBlue = styling.primaryColor;
  const mediumGray = styling.secondaryColor;
  
  const sectionTitleStyle = {
    fontSize: 18,
    fontWeight: 700,
    color: navyBlue,
    margin: '32px 0 12px 0',
    borderBottom: `2px solid ${navyBlue}`,
    paddingBottom: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
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
          color: navyBlue,
          marginBottom: 4
        }}>
          {data.name}
        </h1>
        {data.jobTitle && (
          <h2 style={{ 
            fontSize: 18, 
            fontWeight: 400, 
            margin: 0, 
            color: mediumGray,
            marginBottom: 8
          }}>
            {data.jobTitle}
          </h2>
        )}
        <div style={{ 
          fontSize: 14, 
          color: mediumGray,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
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
        <div>
          <div style={sectionTitleStyle}>Summary</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
            {data.personalSummary}
          </p>
        </div>
      )}

      {/* Professional Experience */}
      {data.workExperience && data.workExperience.length > 0 && (
        <div>
          <div style={sectionTitleStyle}>Professional Experience</div>
          {data.workExperience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              {/* Company and Position */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 2
              }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: navyBlue }}>
                  {exp.company}
                </div>
                <div style={{ fontSize: 14, color: mediumGray, fontStyle: 'italic' }}>
                  {exp.startMonth} {exp.startYear} – {exp.endMonth} {exp.endYear}
                </div>
              </div>
              
              {/* Job Title */}
              <div style={{ 
                fontSize: 15, 
                fontWeight: 600, 
                marginBottom: 8,
                color: '#333'
              }}>
                {exp.title}
              </div>
              
              {/* Description as bullet points */}
              <div style={{ fontSize: 14 }}>
                {exp.description.split('.').filter(item => item.trim()).map((bullet, idx) => (
                  <div key={idx} style={{ 
                    marginBottom: 4,
                    paddingLeft: 16,
                    position: 'relative'
                  }}>
                    <span style={{ 
                      position: 'absolute', 
                      left: 0, 
                      top: 0 
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
        <div>
          <div style={sectionTitleStyle}>Education</div>
          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: 15, 
                    color: navyBlue,
                    marginBottom: 2
                  }}>
                    {edu.degree}
                  </div>
                  <div style={{ 
                    fontSize: 14, 
                    color: '#333' 
                  }}>
                    {edu.school}
                  </div>
                </div>
                <div style={{ 
                  fontSize: 14, 
                  color: mediumGray, 
                  fontStyle: 'italic' 
                }}>
                  {edu.endMonth} {edu.endYear}
                </div>
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
            gap: 32,
            marginBottom: 16
          }}>
            {/* Legal Research */}
            <div>
              <div style={{ 
                fontWeight: 600, 
                fontSize: 15, 
                marginBottom: 8,
                color: '#333'
              }}>
                Legal Research
              </div>
              <div style={{ fontSize: 14 }}>
                <div style={{ marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Westlaw
                </div>
                <div style={{ marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  LexisNexis
                </div>
                <div style={{ marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  CaseText
                </div>
              </div>
            </div>
            
            {/* Courtroom */}
            <div>
              <div style={{ 
                fontWeight: 600, 
                fontSize: 15, 
                marginBottom: 8,
                color: '#333'
              }}>
                Courtroom
              </div>
              <div style={{ fontSize: 14 }}>
                <div style={{ marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Trial Preparation
                </div>
                <div style={{ marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Oral Advocacy
                </div>
                <div style={{ marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Cross-Examination
                </div>
              </div>
            </div>
          </div>
          
          {/* Languages */}
          <div>
            <div style={{ 
              fontWeight: 600, 
              fontSize: 15, 
              marginBottom: 8,
              color: '#333'
            }}>
              Languages
            </div>
            <div style={{ fontSize: 14, paddingLeft: 16, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              Fluent in English and Spanish
            </div>
          </div>
        </div>
      )}
    </div>
  );
}