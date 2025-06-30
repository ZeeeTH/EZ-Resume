import React, { useRef, useLayoutEffect, useState } from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

const A4_HEIGHT_PX = 1123; // A4 at 96dpi

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

  // --- Dynamic page splitting logic ---
  // 1. Prepare section blocks
  const sectionBlocks: React.ReactNode[] = [];
  const refs: React.RefObject<HTMLDivElement>[] = [];

  // Header
  const headerRef = useRef<HTMLDivElement>(null!);
  refs.push(headerRef);
  sectionBlocks.push(
    <div ref={headerRef} key="header">
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
    </div>
  );

  // Summary
  if (summary) {
    const summaryRef = useRef<HTMLDivElement>(null!);
    refs.push(summaryRef);
    sectionBlocks.push(
      <div ref={summaryRef} key="summary">
        <div style={sectionTitleStyle}>Summary</div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{summary}</p>
      </div>
    );
  }

  // Professional Experience
  if (workExperience && workExperience.length > 0) {
    const expRef = useRef<HTMLDivElement>(null!);
    refs.push(expRef);
    sectionBlocks.push(
      <div ref={expRef} key="experience">
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
    );
  }

  // Education
  if (education && education.length > 0) {
    const eduRef = useRef<HTMLDivElement>(null!);
    refs.push(eduRef);
    sectionBlocks.push(
      <div ref={eduRef} key="education">
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
    );
  }

  // Skills
  if (skills && skills.length > 0) {
    const skillsRef = useRef<HTMLDivElement>(null!);
    refs.push(skillsRef);
    sectionBlocks.push(
      <div ref={skillsRef} key="skills">
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
    );
  }

  // 2. Measure heights after mount
  const [pageBlocks, setPageBlocks] = useState<React.ReactNode[][]>([]);

  useLayoutEffect(() => {
    // Wait for refs to be attached
    const heights = refs.map(ref => ref.current?.offsetHeight || 0);
    // Group blocks into pages
    const pages: React.ReactNode[][] = [];
    let currentPage: React.ReactNode[] = [];
    let currentHeight = 0;
    for (let i = 0; i < sectionBlocks.length; i++) {
      const blockHeight = heights[i];
      if (currentHeight + blockHeight > A4_HEIGHT_PX && currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }
      currentPage.push(sectionBlocks[i]);
      currentHeight += blockHeight;
    }
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }
    setPageBlocks(pages);
    // eslint-disable-next-line
  }, [data]);

  // 3. Render pages
  return (
    <div style={{ fontFamily: fonts.body, background: 'white', color: '#333', fontSize: 14, lineHeight: 1.5 }}>
      {pageBlocks.length === 0
        ? sectionBlocks.map((block, i) => (
            <div key={i}>{block}</div>
          ))
        : pageBlocks.map((blocks, i) => (
            <div className="resume-page" key={i} style={{ padding: '96px', maxWidth: 750, margin: '0 auto', minHeight: A4_HEIGHT_PX, boxSizing: 'border-box' }}>
              {blocks}
            </div>
          ))}
    </div>
  );
}