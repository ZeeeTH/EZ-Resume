import React from 'react';
import { ResumeTemplate } from '../../types/templates';

interface JsonTemplateRendererProps {
  template: ResumeTemplate;
  selectedColors?: { primary: string; secondary: string };
}

const JsonTemplateRenderer: React.FC<JsonTemplateRendererProps> = ({ 
  template, 
  selectedColors 
}) => {
  const { sampleData, styling, fonts } = template;
  
  // If no sample data, return empty component
  if (!sampleData) {
    return <div>No sample data available for preview</div>;
  }

  // Debug: Always show basic template info at the top for tech-modern
  if (template.id === 'tech-modern') {
    console.log('Tech-modern template data:', { sampleData, styling, template });
  }
  
  // Use selected colors or fall back to template defaults
  const primaryColor = selectedColors?.primary || styling.primaryColor;
  const secondaryColor = selectedColors?.secondary || styling.secondaryColor;
  
  // For tech-modern, use specific sidebar/main colors instead of primary/secondary
  const sidebarBg = template.id === 'tech-modern' ? '#000000' : primaryColor;
  const sidebarText = template.id === 'tech-modern' ? '#FFFFFF' : 'white';
  const mainBg = template.id === 'tech-modern' ? '#FFFFFF' : 'white';
  const mainText = template.id === 'tech-modern' ? '#000000' : '#333';
  
  // Default fonts if not provided
  const defaultFonts = {
    header: 'Arial, sans-serif',
    section: 'Arial, sans-serif',
    body: 'Arial, sans-serif'
  };
  const finalFonts = fonts || defaultFonts;
  
  const renderSection = (section: any, index: number) => {
    const baseStyle = {
      fontFamily: finalFonts.body,
      color: '#333333',
      lineHeight: '1.5',
      marginBottom: styling.spacing === 'compact' ? '12px' : styling.spacing === 'spacious' ? '24px' : '16px'
    };

    switch (section.title) {
      case 'Summary':
      case 'Professional Summary':
        return (
          <div key={index} style={baseStyle}>
            <h3 style={{ 
              color: primaryColor, 
              fontFamily: finalFonts.section,
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.title}
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              {section.content}
            </p>
          </div>
        );

      case 'Technical Skills':
      case 'Technical Expertise':
      case 'Specialised Skills':
      case 'Skills':
        return (
          <div key={index} style={baseStyle}>
            <h3 style={{ 
              color: primaryColor, 
              fontFamily: finalFonts.section,
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.title}
            </h3>
            {section.categories ? (
              Object.entries(section.categories).map(([category, skills]: [string, any]) => (
                <div key={category} style={{ marginBottom: '8px' }}>
                  <strong style={{ fontSize: '13px', color: secondaryColor }}>
                    {category}:
                  </strong>
                  <span style={{ fontSize: '13px', marginLeft: '8px' }}>
                    {Array.isArray(skills) ? skills.join(', ') : skills}
                  </span>
                </div>
              ))
            ) : null}
          </div>
        );

      case 'Professional Experience':
      case 'Medical Experience':
      case 'Work Experience':
      case 'Clinical Experience':
        return (
          <div key={index} style={baseStyle}>
            <h3 style={{ 
              color: primaryColor, 
              fontFamily: finalFonts.section,
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.title}
            </h3>
            {section.jobs?.map((job: any, jobIndex: number) => (
              <div key={jobIndex} style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: jobIndex < section.jobs.length - 1 ? `1px solid ${primaryColor}20` : 'none' }}>
                <div style={{ marginBottom: '4px' }}>
                  <strong style={{ fontSize: '15px', color: primaryColor }}>
                    {job.title}
                  </strong>
                  <span style={{ fontSize: '14px', color: secondaryColor, marginLeft: '8px' }}>
                    | {job.company}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: secondaryColor, marginBottom: '8px' }}>
                  {job.location} • {job.dates}
                </div>
                <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '13px' }}>
                  {job.bullets?.map((bullet: string, bulletIndex: number) => (
                    <li key={bulletIndex} style={{ marginBottom: '4px', lineHeight: '1.5' }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case 'Education':
      case 'Education & Training':
      case 'Continuing Education':
        return (
          <div key={index} style={baseStyle}>
            <h3 style={{ 
              color: primaryColor, 
              fontFamily: finalFonts.section,
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.title}
            </h3>
            {section.education?.map((edu: any, eduIndex: number) => {
              // Handle both object structure and string array structure
              if (typeof edu === 'string') {
                return (
                  <div key={eduIndex} style={{ marginBottom: '8px', fontSize: '13px' }}>
                    {edu}
                  </div>
                );
              } else {
                return (
                  <div key={eduIndex} style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: primaryColor }}>
                      {edu.degree}
                    </div>
                    <div style={{ fontSize: '13px', color: secondaryColor }}>
                      {edu.institution}
                      {edu.location && ` • ${edu.location}`}
                    </div>
                    <div style={{ fontSize: '12px', color: secondaryColor }}>
                      {edu.dates}
                      {edu.gpa && ` • ${edu.gpa}`}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        );

      case 'Key Projects':
        return (
          <div key={index} style={baseStyle}>
            <h3 style={{ 
              color: primaryColor, 
              fontFamily: finalFonts.section,
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.title}
            </h3>
            {section.projects?.map((project: any, projIndex: number) => (
              <div key={projIndex} style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: primaryColor }}>
                  {project.name}
                </div>
                <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                  {project.description}
                </div>
                <div style={{ fontSize: '12px', color: secondaryColor }}>
                  <strong>Technologies:</strong> {project.technologies?.join(', ')}
                </div>
                {project.achievements && (
                  <div style={{ fontSize: '12px', color: secondaryColor }}>
                    <strong>Achievements:</strong> {project.achievements.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'Certifications & Licences':
      case 'Certifications':
        return (
          <div key={index} style={baseStyle}>
            <h3 style={{ 
              color: primaryColor, 
              fontFamily: finalFonts.section,
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.title}
            </h3>
            <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '13px' }}>
              {section.certifications?.map((cert: string, certIndex: number) => (
                <li key={certIndex} style={{ marginBottom: '4px' }}>
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'Research & Publications':
        return (
          <div key={index} style={baseStyle}>
            <h3 style={{ 
              color: primaryColor, 
              fontFamily: finalFonts.section,
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.title}
            </h3>
            <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '13px' }}>
              {section.publications?.map((pub: string, pubIndex: number) => (
                <li key={pubIndex} style={{ marginBottom: '4px' }}>
                  {pub}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'Professional Memberships':
        return (
          <div key={index} style={baseStyle}>
            <h3 style={{ 
              color: primaryColor, 
              fontFamily: finalFonts.section,
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.title}
            </h3>
            <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '13px' }}>
              {section.memberships?.map((membership: string, memIndex: number) => (
                <li key={memIndex} style={{ marginBottom: '4px' }}>
                  {membership}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'Executive Summary':
      case 'Leadership Experience':
        return (
          <div key={index} style={baseStyle}>
            <h3 style={{ 
              color: primaryColor, 
              fontFamily: finalFonts.section,
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: section.title === 'Executive Summary' ? '8px' : '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.title}
            </h3>
            {section.content && (
              <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>
                {section.content}
              </p>
            )}
            {section.jobs?.map((job: any, jobIndex: number) => (
              <div key={jobIndex} style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: jobIndex < section.jobs.length - 1 ? `1px solid ${primaryColor}20` : 'none' }}>
                <div style={{ marginBottom: '4px' }}>
                  <strong style={{ fontSize: '15px', color: primaryColor }}>
                    {job.title}
                  </strong>
                  <span style={{ fontSize: '14px', color: secondaryColor, marginLeft: '8px' }}>
                    | {job.company}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: secondaryColor, marginBottom: '8px' }}>
                  {job.location} • {job.dates}
                </div>
                <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '13px' }}>
                  {job.bullets?.map((bullet: string, bulletIndex: number) => (
                    <li key={bulletIndex} style={{ marginBottom: '4px', lineHeight: '1.5' }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case 'Key Achievements':
        return (
          <div key={index} style={baseStyle}>
            <h3 style={{ 
              color: primaryColor, 
              fontFamily: finalFonts.section,
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.title}
            </h3>
            <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '13px' }}>
              {section.achievements?.map((achievement: string, achIndex: number) => (
                <li key={achIndex} style={{ marginBottom: '4px', lineHeight: '1.5' }}>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'Board & Advisory Roles':
        return (
          <div key={index} style={baseStyle}>
            <h3 style={{ 
              color: primaryColor, 
              fontFamily: finalFonts.section,
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.title}
            </h3>
            <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '13px' }}>
              {section.roles?.map((role: string, roleIndex: number) => (
                <li key={roleIndex} style={{ marginBottom: '4px' }}>
                  {role}
                </li>
              ))}
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  // Determine layout based on template layout specification
  const isColumnLayout = template.layout && (
    (template.layout.sidebar && template.layout.sidebar.length > 0) ||
    (template.layout.type === 'two-column') ||
    template.id === 'tech-modern'
  );

  const containerStyle = {
    fontFamily: finalFonts.body,
    maxWidth: '210mm',
    margin: '0 auto',
    padding: '20mm',
    backgroundColor: 'white',
    minHeight: '297mm',
    boxSizing: 'border-box' as const,
    fontSize: '14px',
    lineHeight: '1.4'
  };

  if (isColumnLayout) {
    // Check if this is the tech-modern template which needs special sidebar treatment
    const isTechModern = template.id === 'tech-modern';
    
         if (isTechModern) {
       // Tech-modern specific layout matching the exact reference image
       return (
         <div style={{ 
           display: 'flex', 
           fontFamily: 'Arial, sans-serif',
           maxWidth: '210mm',
           margin: '0 auto',
           backgroundColor: 'white',
           minHeight: '297mm',
           boxSizing: 'border-box' as const,
           fontSize: '12px',
           lineHeight: '1.4',
           padding: '0'
         }}>
           {/* Black Sidebar */}
           <div style={{ 
             width: '40%', 
             backgroundColor: sidebarBg, 
             color: sidebarText, 
             padding: '30px 25px', 
             display: 'flex', 
             flexDirection: 'column',
             minHeight: '297mm',
             boxSizing: 'border-box' as const
           }}>
             {/* Arrow and Name */}
             <div style={{ marginBottom: '35px' }}>
               <div style={{ 
                 display: 'flex', 
                 alignItems: 'center', 
                 marginBottom: '20px' 
               }}>
                 <div style={{ 
                   fontSize: '32px', 
                   fontWeight: 'bold', 
                   marginRight: '12px',
                   lineHeight: '1'
                 }}>
                   →
                 </div>
                 <h1 style={{ 
                   fontSize: '20px', 
                   fontWeight: '900', 
                   color: sidebarText,
                   margin: '0',
                   lineHeight: '1',
                   textTransform: 'uppercase',
                   letterSpacing: '1.5px'
                 }}>
                   {sampleData.name.toUpperCase()}
                 </h1>
               </div>
               <div style={{ 
                 width: '60px', 
                 height: '2px', 
                 backgroundColor: sidebarText, 
                 margin: '0'
               }}></div>
             </div>

             {/* Contact Info from sidebar sections */}
             {sampleData.sidebar && sampleData.sidebar.sections && 
               sampleData.sidebar.sections
                 .filter((section: any) => section.type === 'contact')
                 .map((contactSection: any, sectionIndex: number) => (
                   <div key={sectionIndex} style={{ marginBottom: '35px' }}>
                     <h3 style={{ 
                       fontSize: '13px', 
                       fontWeight: 'bold', 
                       color: sidebarText,
                       margin: '0 0 15px 0',
                       textTransform: 'uppercase',
                       letterSpacing: '0.5px'
                     }}>
                       {contactSection.title}
                     </h3>
                     {contactSection.items && contactSection.items.map((item: any, index: number) => {
                       let icon = '📞';
                       if (item.type === 'email') icon = '✉';
                       else if (item.type === 'website') icon = '🌐';
                       else if (item.type === 'location') icon = '📍';

                       return (
                         <div key={index} style={{ 
                           marginBottom: '6px', 
                           fontSize: '10px',
                           display: 'flex',
                           alignItems: 'center',
                           wordBreak: item.type === 'email' || item.type === 'website' ? 'break-all' : 'normal',
                           color: sidebarText
                         }}>
                           <span style={{ marginRight: '6px', fontSize: '8px' }}>{icon}</span>
                           {item.value}
                         </div>
                       );
                     })}
                   </div>
                 ))
             }

             {/* Sidebar Sections - Education and Skills */}
             {sampleData.sidebar && sampleData.sidebar.sections ? 
               sampleData.sidebar.sections.map((section: any, sectionIndex: number) => {
                 if (section.type === 'education') {
                   return (
                     <div key={sectionIndex} style={{ marginBottom: '35px' }}>
                       <h3 style={{ 
                         fontSize: '13px', 
                         fontWeight: 'bold', 
                         color: sidebarText,
                         margin: '0 0 15px 0',
                         textTransform: 'uppercase',
                         letterSpacing: '0.5px'
                       }}>
                         {section.title}
                       </h3>
                       {section.items && section.items.map((edu: any, index: number) => (
                         <div key={index} style={{ marginBottom: '20px' }}>
                           <div style={{ 
                             fontSize: '11px', 
                             fontWeight: 'bold', 
                             marginBottom: '4px',
                             lineHeight: '1.3',
                             color: sidebarText
                           }}>
                             {edu.institution}
                           </div>
                           <div style={{ 
                             fontSize: '10px', 
                             marginBottom: '2px',
                             lineHeight: '1.3',
                             color: sidebarText
                           }}>
                             {edu.degree}
                           </div>
                           <div style={{ 
                             fontSize: '9px', 
                             opacity: 0.9,
                             lineHeight: '1.3',
                             color: sidebarText
                           }}>
                             {edu.dates}
                           </div>
                           {edu.location && (
                             <div style={{ 
                               fontSize: '9px', 
                               opacity: 0.9,
                               lineHeight: '1.3',
                               color: sidebarText
                             }}>
                               {edu.location}
                             </div>
                           )}
                         </div>
                       ))}
                     </div>
                   );
                 } else if (section.type === 'skills') {
                   return (
                     <div key={sectionIndex}>
                       <h3 style={{ 
                         fontSize: '13px', 
                         fontWeight: 'bold', 
                         color: sidebarText,
                         margin: '0 0 15px 0',
                         textTransform: 'uppercase',
                         letterSpacing: '0.5px'
                       }}>
                         {section.title}
                       </h3>
                       <div style={{ 
                         fontSize: '10px', 
                         lineHeight: '1.5',
                         textAlign: 'justify',
                         color: sidebarText
                       }}>
                         {section.content}
                       </div>
                     </div>
                   );
                 }
                 return null;
               }) : (
                 <div style={{ color: sidebarText, fontSize: '10px' }}>
                   <p>DEBUG: No sidebar sections found</p>
                   <p>Sidebar exists: {sampleData.sidebar ? 'Yes' : 'No'}</p>
                 </div>
               )
             }
           </div>

           {/* Main Content */}
           <div style={{ 
             width: '60%', 
             backgroundColor: mainBg,
             color: mainText,
             padding: '30px 25px', 
             boxSizing: 'border-box' as const,
             minHeight: '297mm'
           }}>
             {/* Main Content Sections */}
             {sampleData.sections && sampleData.sections.length > 0 ? 
               sampleData.sections.map((section: any, index: number) => {
                 if (section.type === 'summary') {
                   return (
                     <div key={index} style={{ marginBottom: '30px' }}>
                                            <h3 style={{ 
                       fontSize: '15px', 
                       fontWeight: 'bold', 
                       color: mainText,
                       margin: '0 0 12px 0',
                       textTransform: 'uppercase',
                       letterSpacing: '0.5px'
                     }}>
                       {section.title}
                     </h3>
                     <p style={{ 
                       fontSize: '10px', 
                       lineHeight: '1.6', 
                       margin: '0',
                       textAlign: 'justify',
                       color: mainText
                     }}>
                         {section.content}
                       </p>
                     </div>
                   );
                 } else if (section.type === 'experience') {
                   return (
                     <div key={index}>
                                            <h3 style={{ 
                       fontSize: '15px', 
                       fontWeight: 'bold', 
                       color: mainText,
                       margin: '0 0 18px 0',
                       textTransform: 'uppercase',
                       letterSpacing: '0.5px'
                     }}>
                       {section.title}
                     </h3>
                       {section.jobs?.map((job: any, jobIndex: number) => (
                         <div key={jobIndex} style={{ marginBottom: '25px' }}>
                                                    <div style={{ 
                           fontSize: '12px', 
                           fontWeight: 'bold', 
                           color: mainText,
                           marginBottom: '3px'
                         }}>
                           {job.title}
                         </div>
                         <div style={{ 
                           fontSize: '11px', 
                           color: mainText,
                           marginBottom: '2px'
                         }}>
                           {job.company}
                         </div>
                           <div style={{ 
                             fontSize: '9px', 
                             color: mainText,
                             marginBottom: '10px',
                             fontStyle: 'italic'
                           }}>
                             {job.dates}
                           </div>
                           <ul style={{ 
                             margin: '0', 
                             paddingLeft: '12px',
                             listStyleType: 'disc'
                           }}>
                             {job.bullets?.map((bullet: string, bulletIndex: number) => (
                                                            <li key={bulletIndex} style={{ 
                               marginBottom: '4px', 
                               fontSize: '10px', 
                               lineHeight: '1.5', 
                               color: mainText,
                               textAlign: 'justify'
                             }}>
                                 {bullet}
                               </li>
                             ))}
                           </ul>
                         </div>
                       ))}
                     </div>
                   );
                 }
                 return null;
               }) : (
                 <div style={{ color: mainText, fontSize: '12px' }}>
                   <h3>DEBUG: No sections found</h3>
                   <p>Template ID: {template.id}</p>
                   <p>Sample data keys: {Object.keys(sampleData).join(', ')}</p>
                 </div>
               )
             }
           </div>
         </div>
       );
     }

    // Default two-column layout for other templates
    const mainSections = template.layout?.main || [];
    const sidebarSections = template.layout?.sidebar || [];

    return (
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ marginBottom: '24px', textAlign: 'center', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '16px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: primaryColor,
            fontFamily: finalFonts.header,
            margin: '0 0 8px 0'
          }}>
            {sampleData.name}
          </h1>
          {sampleData.title && (
            <h2 style={{ 
              fontSize: '16px', 
              color: secondaryColor,
              fontFamily: finalFonts.section,
              margin: '0 0 12px 0',
              fontWeight: 'normal'
            }}>
              {sampleData.title}
            </h2>
          )}
          <div style={{ fontSize: '12px', color: secondaryColor }}>
            {sampleData.contact.email} • {sampleData.contact.phone} • {sampleData.contact.location}
            {sampleData.contact.linkedin && ` • ${sampleData.contact.linkedin}`}
            {sampleData.contact.github && ` • ${sampleData.contact.github}`}
            {sampleData.contact.website && ` • ${sampleData.contact.website}`}
          </div>
        </div>

        {/* Two-column content */}
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Main content */}
          <div style={{ flex: '2' }}>
            {sampleData.sections
              .filter((section: any) => mainSections.some((main: string) => 
                section.title?.toLowerCase().includes(main.replace('-', ' ').replace('_', ' '))
              ))
              .map((section: any, index: number) => renderSection(section, index))
            }
          </div>

          {/* Sidebar */}
          <div style={{ flex: '1', paddingLeft: '20px', borderLeft: `1px solid ${primaryColor}30` }}>
            {sampleData.sections
              .filter((section: any) => sidebarSections.some((sidebar: string) => 
                section.title?.toLowerCase().includes(sidebar.replace('-', ' ').replace('_', ' '))
              ))
              .map((section: any, index: number) => renderSection(section, index))
            }
          </div>
        </div>
      </div>
    );
  }

  // Single-column layout
  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ marginBottom: '24px', textAlign: 'center', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '16px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: primaryColor,
          fontFamily: finalFonts.header,
          margin: '0 0 8px 0'
        }}>
          {sampleData.name}
        </h1>
        {sampleData.title && (
          <h2 style={{ 
            fontSize: '16px', 
            color: secondaryColor,
            fontFamily: finalFonts.section,
            margin: '0 0 12px 0',
            fontWeight: 'normal'
          }}>
            {sampleData.title}
          </h2>
        )}
        <div style={{ fontSize: '12px', color: secondaryColor }}>
          {sampleData.contact.email} • {sampleData.contact.phone} • {sampleData.contact.location}
          {sampleData.contact.linkedin && ` • ${sampleData.contact.linkedin}`}
          {sampleData.contact.github && ` • ${sampleData.contact.github}`}
          {sampleData.contact.website && ` • ${sampleData.contact.website}`}
        </div>
      </div>

      {/* Content sections */}
      <div>
        {sampleData.sections?.map((section: any, index: number) => renderSection(section, index))}
      </div>
    </div>
  );
};

export default JsonTemplateRenderer; 