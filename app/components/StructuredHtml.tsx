import React from 'react';
import structuredTemplate from '../../data/templates/structured.json';
import { FormData } from '../../types';

export default function StructuredHtml({ data }: { data: FormData }) {
  const { styling } = structuredTemplate;
  return (
    <div style={{ fontFamily: styling.fontFamily, padding: 40, maxWidth: 800, margin: '0 auto', background: 'white', color: styling.primaryColor }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 0 }}>{data.name}</h1>
      {data.jobTitle && <h2 style={{ fontSize: 22, fontWeight: 400, marginTop: 4 }}>{data.jobTitle}</h2>}
      <div style={{ margin: '12px 0', fontSize: 16, color: styling.secondaryColor }}>
        {data.phone && <span>{data.phone}</span>}
        {data.phone && data.email && <span> • </span>}
        {data.email && <span>{data.email}</span>}
        {(data.phone || data.email) && data.location && <span> • </span>}
        {data.location && <span>{data.location}</span>}
      </div>
      {data.personalSummary && <p style={{ fontStyle: 'italic', margin: '16px 0', color: styling.secondaryColor }}>{data.personalSummary}</p>}
      {/* ...rest of the layout... */}
    </div>
  );
} 