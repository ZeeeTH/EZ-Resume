import React from 'react';
import { FormData } from '../../types'; // Adjust path if needed

export default function ResumeHtml({ data }: { data: FormData }) {
  return (
    <div style={{ fontFamily: 'Inter, Georgia, serif', padding: 40, maxWidth: 800, margin: '0 auto', background: 'white', color: '#222' }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 0 }}>{data.name}</h1>
      {data.jobTitle && <h2 style={{ fontSize: 22, fontWeight: 400, marginTop: 4 }}>{data.jobTitle}</h2>}
      <div style={{ margin: '12px 0', fontSize: 16 }}>
        {data.phone && <span>{data.phone}</span>}
        {data.phone && data.email && <span> • </span>}
        {data.email && <span>{data.email}</span>}
        {(data.phone || data.email) && data.location && <span> • </span>}
        {data.location && <span>{data.location}</span>}
      </div>
      {data.personalSummary && <p style={{ fontStyle: 'italic', margin: '16px 0' }}>{data.personalSummary}</p>}
      <h3 style={{ fontSize: 20, fontWeight: 700, marginTop: 32 }}>Skills</h3>
      <ul style={{ columns: 2, fontSize: 16, margin: 0, padding: 0, listStyle: 'disc inside' }}>
        {data.skills.split(',').map((skill, i) => (
          <li key={i}>{skill.trim()}</li>
        ))}
      </ul>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginTop: 32 }}>Achievements</h3>
      <p style={{ fontSize: 16 }}>{data.achievements}</p>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginTop: 32 }}>Work Experience</h3>
      {data.workExperience.map((exp, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600 }}>{exp.title} at {exp.company}</div>
          <div style={{ fontSize: 14, color: '#666' }}>{exp.startMonth} {exp.startYear} - {exp.endMonth} {exp.endYear}</div>
          <div style={{ fontSize: 16 }}>{exp.description}</div>
        </div>
      ))}
      <h3 style={{ fontSize: 20, fontWeight: 700, marginTop: 32 }}>Education</h3>
      {data.education.map((edu, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600 }}>{edu.degree} at {edu.school}</div>
          <div style={{ fontSize: 14, color: '#666' }}>{edu.startMonth} {edu.startYear} - {edu.endMonth} {edu.endYear}</div>
        </div>
      ))}
    </div>
  );
} 