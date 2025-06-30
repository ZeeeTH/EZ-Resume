import React from 'react';
import { FormData } from '../../types';

export default function CoverLetterHtml({ content, data }: { content: string; data: FormData }) {
  return (
    <div style={{ fontFamily: 'Georgia, Inter, serif', padding: 40, maxWidth: 800, margin: '0 auto', background: 'white', color: '#222' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 0 }}>{data.name}</h1>
      <div style={{ margin: '8px 0', fontSize: 16 }}>
        {data.email && <span>{data.email}</span>}
        {data.email && data.phone && <span> • </span>}
        {data.phone && <span>{data.phone}</span>}
        {(data.email || data.phone) && data.location && <span> • </span>}
        {data.location && <span>{data.location}</span>}
      </div>
      <div style={{ margin: '24px 0', fontSize: 16, whiteSpace: 'pre-line' }}>{content}</div>
    </div>
  );
} 