import React from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

export default function ModernHtml({ data }: { data: FormData }) {
  const template = getTemplateById('modern')!;
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
            {name}
          </h1>
          <h2 style={{ 
            fontSize: 16, 
            fontWeight: 400, 
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: 2,
            opacity: 0.9
          }}>
            {jobTitle}
          </h2>
          
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
          {phone && <div style={{ 
            marginBottom: 12, 
            fontSize: 14,
            opacity: 0.9
          }}>{phone}</div>}
          {email && <div style={{ 
            marginBottom: 12, 
            fontSize: 14,
            opacity: 0.9,
            wordBreak: 'break-word'
          }}>{email}</div>}
          {location && <div style={{ 
            fontSize: 14,
            opacity: 0.9
          }}>{location}</div>}
        </div>

        {/* Summary */}
        {summary && (
          <div style={{ marginBottom: 40 }}>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontFamily: fonts.section,
            }}>
              Summary
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: 15, 
              lineHeight: 1.6,
              opacity: 0.9
            }}>
              {summary}
            </p>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontFamily: fonts.section,
            }}>
              Skills
            </div>
            
            {/* Design Tools */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ 
                fontWeight: 700, 
                fontSize: 15, 
                marginBottom: 12
              }}>
                Design Tools
              </div>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8
              }}>
                {skills.map((skill, idx) => (
                  <span key={idx} style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: 12,
                    color: 'white'
                  }}>{skill}</span>
                ))}
              </div>
            </div>
            
            {/* Front-End */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ 
                fontWeight: 700, 
                fontSize: 15, 
                marginBottom: 12
              }}>
                Front-End
              </div>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8
              }}>
                {skills.map((skill, idx) => (
                  <span key={idx} style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: 12,
                    color: 'white'
                  }}>{skill}</span>
                ))}
              </div>
            </div>
            
            {/* Research */}
            <div>
              <div style={{ 
                fontWeight: 700, 
                fontSize: 15, 
                marginBottom: 12
              }}>
                Research
              </div>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8
              }}>
                {skills.map((skill, idx) => (
                  <span key={idx} style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: 12,
                    color: 'white'
                  }}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div style={{
        width: '65%',
        padding: '48px 40px',
        backgroundColor: 'white'
      }}>
        {/* Professional Experience */}
        {workExperience && workExperience.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={sectionTitleStyle}>Professional Experience</div>
            {workExperience.map((job, i) => (
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
                    {job.company}
                  </div>
                  <div style={{ 
                    fontSize: 14, 
                    color: '#666',
                    fontStyle: 'italic'
                  }}>
                    {job.dates}
                  </div>
                </div>
                
                {/* Job Title */}
                <div style={{ 
                  fontSize: 15, 
                  fontWeight: 600, 
                  marginBottom: 12,
                  color: '#333'
                }}>
                  {job.title}
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
                        color: styling.primaryColor,
                        fontWeight: 'bold'
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
                    color: styling.primaryColor
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
      </div>
    </div>
  );
}