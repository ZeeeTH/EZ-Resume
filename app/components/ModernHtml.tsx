import React from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

export default function ModernHtml({ data }: { data: FormData }) {
  const template = getTemplateById('modern')!;
  const { styling, fonts } = template;
  
  const sectionTitleStyle = {
    fontSize: 18,
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
      display: 'flex',
      minHeight: '100vh',
      background: 'white',
      fontSize: 14
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: '35%',
        backgroundColor: styling.primaryColor,
        color: 'white',
        padding: '48px 32px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Name and Title */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            margin: 0,
            lineHeight: 1.1,
            marginBottom: 16,
            fontFamily: fonts.header
          }}>
            {data.name}
          </h1>
          {data.jobTitle && (
            <h2 style={{ 
              fontSize: 16, 
              fontWeight: 400, 
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: 2,
              opacity: 0.9
            }}>
              {data.jobTitle}
            </h2>
          )}
          
          {/* Divider line */}
          <div style={{
            width: 60,
            height: 3,
            backgroundColor: 'white',
            margin: '20px 0'
          }} />
        </div>

        {/* Contact Info */}
        <div style={{ marginBottom: 40 }}>
          {data.phone && (
            <div style={{ 
              marginBottom: 12, 
              fontSize: 14,
              opacity: 0.9
            }}>
              {data.phone}
            </div>
          )}
          {data.email && (
            <div style={{ 
              marginBottom: 12, 
              fontSize: 14,
              opacity: 0.9,
              wordBreak: 'break-word'
            }}>
              {data.email}
            </div>
          )}
          {data.location && (
            <div style={{ 
              fontSize: 14,
              opacity: 0.9
            }}>
              {data.location}
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div style={{
        width: '65%',
        padding: '48px 40px',
        backgroundColor: 'white'
      }}>
        {/* Summary */}
        {data.personalSummary && (
          <div style={{ marginBottom: 40 }}>
            <div style={sectionTitleStyle}>Summary</div>
            <p style={{ 
              margin: 0, 
              fontSize: 15, 
              lineHeight: 1.6,
              color: '#333'
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
                {/* Company and Date */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 4
                }}>
                  <div style={{ 
                    fontWeight: 700, 
                    fontSize: 16, 
                    color: styling.primaryColor
                  }}>
                    {exp.company}
                  </div>
                  <div style={{ 
                    fontSize: 14, 
                    color: '#666',
                    fontStyle: 'italic'
                  }}>
                    {exp.startMonth} {exp.startYear} – {exp.endMonth} {exp.endYear}
                  </div>
                </div>
                
                {/* Job Title */}
                <div style={{ 
                  fontSize: 15, 
                  fontWeight: 600, 
                  marginBottom: 12,
                  color: '#333'
                }}>
                  {exp.title}
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
                        color: styling.primaryColor,
                        fontWeight: 'bold'
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
                    color: styling.primaryColor
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
              gap: 32,
              marginBottom: 24
            }}>
              {/* Design Tools */}
              <div>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: 15, 
                  marginBottom: 12,
                  color: styling.primaryColor
                }}>
                  Design Tools
                </div>
                <div style={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12
                }}>
                  <span style={{
                    backgroundColor: '#f3f4f6',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 13,
                    color: '#374151'
                  }}>Figma</span>
                  <span style={{
                    backgroundColor: '#f3f4f6',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 13,
                    color: '#374151'
                  }}>Sketch</span>
                  <span style={{
                    backgroundColor: '#f3f4f6',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 13,
                    color: '#374151'
                  }}>Adobe XD</span>
                  <span style={{
                    backgroundColor: '#f3f4f6',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 13,
                    color: '#374151'
                  }}>InVision</span>
                </div>
              </div>
              
              {/* Front-End */}
              <div>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: 15, 
                  marginBottom: 12,
                  color: styling.primaryColor
                }}>
                  Front-End
                </div>
                <div style={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12
                }}>
                  <span style={{
                    backgroundColor: '#f3f4f6',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 13,
                    color: '#374151'
                  }}>HTML5</span>
                  <span style={{
                    backgroundColor: '#f3f4f6',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 13,
                    color: '#374151'
                  }}>CSS3</span>
                  <span style={{
                    backgroundColor: '#f3f4f6',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 13,
                    color: '#374151'
                  }}>JavaScript</span>
                  <span style={{
                    backgroundColor: '#f3f4f6',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 13,
                    color: '#374151'
                  }}>React</span>
                </div>
              </div>
            </div>
            
            {/* Research */}
            <div>
              <div style={{ 
                fontWeight: 700, 
                fontSize: 15, 
                marginBottom: 12,
                color: styling.primaryColor
              }}>
                Research
              </div>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <span style={{
                  backgroundColor: '#f3f4f6',
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  color: '#374151'
                }}>User Interviews</span>
                <span style={{
                  backgroundColor: '#f3f4f6',
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  color: '#374151'
                }}>Usability Testing</span>
                <span style={{
                  backgroundColor: '#f3f4f6',
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  color: '#374151'
                }}>A/B Testing</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}