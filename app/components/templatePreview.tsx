import React from 'react';
import { ResumeTemplate } from '../../types/templates';

interface TemplatePreviewProps {
  showTemplatePreview: boolean;
  previewTemplate: ResumeTemplate | null;
  selectedColorVariants: Record<string, number>;
  setShowTemplatePreview: (show: boolean) => void;
  setSelectedTemplate: (template: string) => void;
  setValue: (name: any, value: any, options?: any) => void;
}

export default function TemplatePreview({
  showTemplatePreview,
  previewTemplate,
  selectedColorVariants,
  setShowTemplatePreview,
  setSelectedTemplate,
  setValue
}: TemplatePreviewProps) {
  if (!showTemplatePreview || !previewTemplate) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/70">
      <div className="relative w-[794px] max-w-full overflow-auto">
        <div className="w-full h-full flex items-center justify-center select-none">
          <div className="relative w-full">
            <button
              onClick={() => setShowTemplatePreview(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-pink-400 text-2xl font-bold z-10 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-colors duration-200"
              aria-label="Close preview"
            >
              ×
            </button>
            <div className="w-full h-full flex items-center justify-center">
              {/* Use selected color variant for preview */}
              {(() => {
                const colorPalette = previewTemplate.colorOptions?.palette || [];
                const color = colorPalette[selectedColorVariants[previewTemplate.id] ?? 0] || {
                  primary: previewTemplate.styling.primaryColor,
                  secondary: previewTemplate.styling.secondaryColor,
                };
                const primaryColor = color.primary;
                const secondaryColor = color.secondary;

                // All preview blocks below should use primaryColor/secondaryColor instead of previewTemplate.styling.primaryColor/secondaryColor
                if (previewTemplate.id === 'classic') {
                  return (
                    <div className="bg-white rounded-lg shadow-lg w-full p-8 pb-8" style={{ fontFamily: previewTemplate.styling.fontFamily }}>
                      <div className="px-2 md:px-8 py-6" style={{ fontFamily: previewTemplate.fonts?.body || previewTemplate.styling.fontFamily }}>
                        {/* Header */}
                        <div>
                          <h1
                            className="text-4xl md:text-5xl font-extrabold mb-1 tracking-tight"
                            style={{ color: primaryColor, fontFamily: previewTemplate.fonts?.header }}
                          >
                            {previewTemplate.sampleData.name}
                          </h1>
                          <div className="w-full border-t-2" style={{ borderColor: primaryColor, margin: '0.5rem 0' }} />
                          {previewTemplate.sampleData.title && (
                            <div className="uppercase text-gray-700 font-bold tracking-widest text-lg md:text-xl mb-2" style={{ fontFamily: previewTemplate.fonts?.section }}>
                              {previewTemplate.sampleData.title}
                            </div>
                          )}
                          {/* Contact Row */}
                          {(previewTemplate.sampleData.contact.phone || previewTemplate.sampleData.contact.email || previewTemplate.sampleData.contact.location) && (
                            <div className="flex flex-wrap items-center text-base text-gray-700 gap-x-3 gap-y-1 mb-1">
                              {previewTemplate.sampleData.contact.phone && <span>{previewTemplate.sampleData.contact.phone}</span>}
                              {previewTemplate.sampleData.contact.phone && previewTemplate.sampleData.contact.email && <span className="mx-1" style={{ color: primaryColor }}>•</span>}
                              {previewTemplate.sampleData.contact.email && <span>{previewTemplate.sampleData.contact.email}</span>}
                              {(previewTemplate.sampleData.contact.phone || previewTemplate.sampleData.contact.email) && previewTemplate.sampleData.contact.location && <span className="mx-1" style={{ color: primaryColor }}>•</span>}
                              {previewTemplate.sampleData.contact.location && <span>{previewTemplate.sampleData.contact.location}</span>}
                            </div>
                          )}
                        </div>
                        {/* Sections */}
                        {previewTemplate.sampleData.sections.map((section: any, idx: number) => (
                          <div key={idx} className={idx === previewTemplate.sampleData.sections.length - 1 ? 'mb-4' : ''}>
                            <h2
                              className="text-xl md:text-2xl font-extrabold uppercase mb-2 tracking-wide border-b-2 pb-1"
                              style={{ color: primaryColor, fontFamily: previewTemplate.fonts?.section, letterSpacing: '0.04em', borderColor: primaryColor }}
                            >
                              {section.title}
                            </h2>
                            {/* Summary */}
                            {section.content && (
                              <p className="text-gray-800 text-lg leading-relaxed mb-2" style={{ fontFamily: previewTemplate.fonts?.body }}>{section.content}</p>
                            )}
                            {/* Experience */}
                            {section.jobs && section.jobs.length > 0 && (
                              <div className="space-y-6">
                                {section.jobs.map((job: any, j: number) => (
                                  <div key={j}>
                                    {/* Company always on its own line */}
                                    <div className="font-bold text-gray-900 text-lg md:text-xl" style={{ fontFamily: previewTemplate.fonts?.section }}>
                                      {job.company}
                                    </div>
                                    {/* Job Title and Dates on same line */}
                                    {job.title && (
                                      <div className="flex justify-between items-center text-gray-800 font-semibold text-lg mb-1" style={{ fontFamily: previewTemplate.fonts?.body }}>
                                        <div>{job.title}</div>
                                        {job.dates && <div className="italic text-gray-600 text-base font-normal">{job.dates}</div>}
                                      </div>
                                    )}
                                    {job.bullets && job.bullets.length > 0 && (
                                      <div className={`grid ${job.bullets.length > 2 ? 'md:grid-cols-2' : ''} gap-x-8 gap-y-1 mt-2`}>
                                        {job.bullets.map((b: string, k: number) => (
                                          <div key={k} className="flex items-start gap-2">
                                            <span className="mt-1" style={{ color: primaryColor }}>■</span>
                                            <span className="text-gray-800 text-base leading-snug" style={{ fontFamily: previewTemplate.fonts?.body }}>{b}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Education */}
                            {section.education && section.education.length > 0 && (
                              <div className="space-y-2">
                                {section.education.map((edu: any, e: number) => (
                                  <div key={e}>
                                    {/* Degree always on its own line */}
                                    <div className="font-bold text-gray-900 text-lg md:text-xl" style={{ fontFamily: previewTemplate.fonts?.section }}>{edu.degree}</div>
                                    {/* School/University and Dates on same line */}
                                    {(edu.institution || edu.dates) && (
                                      <div className="flex flex-col md:flex-row md:justify-between md:items-center text-base md:text-lg text-gray-700 mt-0 mb-1" style={{ fontFamily: previewTemplate.fonts?.body }}>
                                        <div>{edu.institution}</div>
                                        <div className="italic">{edu.dates}</div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Skills */}
                            {section.categories && Object.keys(section.categories).length > 0 && (
                              <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 mt-2">
                                {Object.entries(section.categories).map(([cat, skills]: [string, any]) => (
                                  Array.isArray(skills) && skills.length > 0 && (
                                    <div key={cat}>
                                      <div className="font-bold text-gray-900 mb-1 text-lg" style={{ fontFamily: previewTemplate.fonts?.section }}>{cat}</div>
                                      <ul className="list-none pl-0 space-y-1">
                                        {skills.map((s: string, si: number) => (
                                          <li key={si} className="flex items-start gap-2">
                                            <span className="mt-1" style={{ color: primaryColor }}>■</span>
                                            <span className="text-gray-800 text-base leading-snug" style={{ fontFamily: previewTemplate.fonts?.body }}>{s}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else if (previewTemplate.id === 'modern') {
                  return (
                    <div className="bg-white rounded-lg shadow-lg w-full h-full p-8 flex flex-col md:flex-row overflow-hidden" style={{ fontFamily: previewTemplate.fonts?.body || previewTemplate.styling.fontFamily }}>
                      {/* Sidebar */}
                      <div
                        className="md:w-1/3 w-full bg-gradient-to-b from-blue-900 to-blue-600 text-white p-8 flex flex-col items-center md:items-start"
                        style={{ background: `linear-gradient(180deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
                      >
                        <h1
                          className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight text-center md:text-left"
                          style={{ fontFamily: previewTemplate.fonts?.header }}
                        >
                          {previewTemplate.sampleData.name}
                        </h1>
                        {previewTemplate.sampleData.title && (
                          <div className="uppercase opacity-80 font-bold tracking-widest text-base md:text-lg mb-4 text-center md:text-left" style={{ fontFamily: previewTemplate.fonts?.section }}>
                            {previewTemplate.sampleData.title}
                          </div>
                        )}
                        <div className="w-12 border-b-2 mb-4" style={{ borderColor: 'white' }} />
                        {/* Contact Info */}
                        <div className="flex flex-col gap-2 w-full text-sm md:text-base">
                          {previewTemplate.sampleData.contact.phone && (
                            <div className="flex items-center gap-2">
                              <span>{previewTemplate.sampleData.contact.phone}</span>
                            </div>
                          )}
                          {previewTemplate.sampleData.contact.email && (
                            <div className="flex items-center gap-2">
                              <span>{previewTemplate.sampleData.contact.email}</span>
                            </div>
                          )}
                          {previewTemplate.sampleData.contact.location && (
                            <div className="flex items-center gap-2">
                              <span>{previewTemplate.sampleData.contact.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Main Content */}
                      <div className="md:w-2/3 w-full bg-white p-8 flex flex-col gap-8">
                        {previewTemplate.sampleData.sections.map((section: any, idx: number) => (
                          <div key={idx} className={idx === previewTemplate.sampleData.sections.length - 1 ? 'mb-0' : 'mb-2'}>
                            <h2
                              className="text-xl font-extrabold uppercase mb-2 tracking-wide"
                              style={{
                                color: primaryColor,
                                fontFamily: previewTemplate.fonts?.section,
                                letterSpacing: '0.04em',
                                borderBottom: `3px solid ${primaryColor}`,
                                display: 'inline-block',
                                paddingBottom: '2px',
                              }}
                            >
                              {section.title}
                            </h2>
                            {/* Summary */}
                            {section.content && (
                              <p className="text-gray-800 text-lg leading-relaxed mb-4" style={{ fontFamily: previewTemplate.fonts?.body }}>{section.content}</p>
                            )}
                            {/* Experience */}
                            {section.jobs && section.jobs.length > 0 && (
                              <div className="space-y-6">
                                {section.jobs.map((job: any, j: number) => (
                                  <div key={j}>
                                    <div className="font-bold text-gray-900 text-lg" style={{ fontFamily: previewTemplate.fonts?.section }}>{job.company}</div>
                                    <div className="flex flex-row justify-between items-center text-base md:text-lg text-gray-700 mt-0 mb-1" style={{ fontFamily: previewTemplate.fonts?.body }}>
                                      <div className="text-gray-700 font-semibold text-base" style={{ fontFamily: previewTemplate.fonts?.body }}>{job.title}</div>
                                      <div className="italic text-gray-600 text-sm md:text-base" style={{ fontFamily: previewTemplate.fonts?.body }}>{job.dates}</div>
                                    </div>
                                    {job.bullets && job.bullets.length > 0 && (
                                      <ul className="list-disc pl-6 space-y-1">
                                        {job.bullets.map((b: string, k: number) => (
                                          <li key={k} className="text-gray-800 text-sm leading-relaxed" style={{ fontFamily: previewTemplate.fonts?.body }}>{b}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Education */}
                            {section.education && section.education.length > 0 && (
                              <div className="space-y-4">
                                {section.education.map((edu: any, e: number) => (
                                  <div key={e}>
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
                                      <div className="font-bold text-gray-900 text-lg" style={{ fontFamily: previewTemplate.fonts?.section }}>{edu.degree}</div>
                                      <div className="text-gray-600 text-sm italic" style={{ fontFamily: previewTemplate.fonts?.body }}>{edu.dates}</div>
                                    </div>
                                    <div className="text-gray-700 text-base" style={{ fontFamily: previewTemplate.fonts?.body }}>{edu.institution}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Skills */}
                            {section.categories && Object.keys(section.categories).length > 0 && (
                              <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                                {Object.entries(section.categories).map(([cat, skills]: [string, any]) => (
                                  Array.isArray(skills) && skills.length > 0 && (
                                    <div key={cat}>
                                      <div className="font-bold text-gray-900 mb-2 text-base" style={{ fontFamily: previewTemplate.fonts?.section }}>{cat}</div>
                                      <div className="flex flex-wrap gap-2">
                                        {skills.map((s: string, si: number) => (
                                          <span key={si} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm" style={{ fontFamily: previewTemplate.fonts?.body }}>{s}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else if (previewTemplate.id === 'structured') {
                  return (
                    <div className="bg-white rounded-lg shadow-lg w-full h-full p-8 pt-8" style={{ fontFamily: previewTemplate.fonts?.body || previewTemplate.styling.fontFamily }}>
                      {/* Header */}
                      <div className="flex flex-col items-center text-center pt-8">
                        <h1
                          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-1"
                          style={{ color: primaryColor, fontFamily: previewTemplate.fonts?.header }}
                        >
                          {previewTemplate.sampleData.name}
                        </h1>
                        {previewTemplate.sampleData.title && (
                          <div className="uppercase text-gray-700 font-bold tracking-widest text-lg md:text-xl mb-1" style={{ fontFamily: previewTemplate.fonts?.section }}>{previewTemplate.sampleData.title}</div>
                        )}
                        <div className="w-full border-t-2" style={{ borderColor: primaryColor, margin: '0.5rem 0' }} />
                        {(previewTemplate.sampleData.contact.phone || previewTemplate.sampleData.contact.email || previewTemplate.sampleData.contact.location) && (
                          <div className="flex flex-wrap justify-center items-center text-base text-gray-700 gap-x-3 gap-y-1">
                            {previewTemplate.sampleData.contact.phone && <span>{previewTemplate.sampleData.contact.phone}</span>}
                            {previewTemplate.sampleData.contact.phone && previewTemplate.sampleData.contact.email && <span className="mx-1" style={{ color: primaryColor }}>•</span>}
                            {previewTemplate.sampleData.contact.email && <span>{previewTemplate.sampleData.contact.email}</span>}
                            {(previewTemplate.sampleData.contact.phone || previewTemplate.sampleData.contact.email) && previewTemplate.sampleData.contact.location && <span className="mx-1" style={{ color: primaryColor }}>•</span>}
                            {previewTemplate.sampleData.contact.location && <span>{previewTemplate.sampleData.contact.location}</span>}
                          </div>
                        )}
                        <div className="w-full border-t-2" style={{ borderColor: primaryColor, margin: '0.5rem 0' }} />
                        {/* Italic summary */}
                        {previewTemplate.sampleData.sections.find((s: any) => s.title === 'Summary' && s.content) && (
                          <div className="italic text-gray-700 text-lg max-w-3xl mx-auto mb-2" style={{ fontFamily: previewTemplate.fonts?.body }}>
                            {previewTemplate.sampleData.sections.find((s: any) => s.title === 'Summary')?.content}
                          </div>
                        )}
                      </div>
                      {/* Sections */}
                      {previewTemplate.sampleData.sections.map((section: any, idx: number) => (
                        section.title !== 'Summary' && (
                          <div key={idx} className={idx === previewTemplate.sampleData.sections.length - 1 ? 'mb-0' : 'mb-2'}>
                            <h2
                              className="text-2xl md:text-3xl font-extrabold uppercase mb-1 tracking-wide"
                              style={{ color: primaryColor, fontFamily: previewTemplate.fonts?.section, letterSpacing: '0.04em' }}
                            >
                              {section.title}
                            </h2>
                            <div className="w-16 border-b-2 mb-3" style={{ borderColor: primaryColor }} />
                            {/* Professional Experience */}
                            {
                              <div className="space-y-6">
                                {section.jobs && section.jobs.map((job: any, j: number) => (
                                  <div key={j}>
                                    {/* Company always on its own line */}
                                    <div className="font-bold text-gray-900 text-lg md:text-xl uppercase tracking-wide" style={{ fontFamily: previewTemplate.fonts?.section }}>
                                      {job.company}
                                    </div>
                                    {/* Job Title and Dates on same line */}
                                    {job.title && (
                                      <div className="flex justify-between items-center text-gray-800 font-semibold text-lg mb-1" style={{ fontFamily: previewTemplate.fonts?.body }}>
                                        <div>{job.title}</div>
                                        {job.dates && <div className="italic text-gray-600 text-base font-normal">{job.dates}</div>}
                                      </div>
                                    )}
                                    {job.bullets && job.bullets.length > 0 && (
                                      <ul className="list-disc pl-6 text-gray-800 text-base space-y-1" style={{ fontFamily: previewTemplate.fonts?.body }}>
                                        {job.bullets.map((b: string, k: number) => (
                                          <li key={k}>{b}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>
                            }
                            {/* Education */}
                            {section.title === 'Education' && section.education && section.education.length > 0 && (
                              <div className="space-y-6">
                                {section.education.map((edu: any, e: number) => (
                                  <div key={e}>
                                    {/* Degree always on its own line */}
                                    <div className="font-bold text-gray-900 text-lg md:text-xl uppercase tracking-wide" style={{ fontFamily: previewTemplate.fonts?.section }}>{edu.degree}</div>
                                    {/* School/University and Dates on same line */}
                                    {(edu.institution || edu.dates) && (
                                      <div className="flex flex-col md:flex-row md:justify-between md:items-center text-base md:text-lg text-gray-700 mt-0 mb-1" style={{ fontFamily: previewTemplate.fonts?.body }}>
                                        <div>{edu.institution}</div>
                                        <div className="italic">{edu.dates}</div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Skills */}
                            {section.categories && Object.keys(section.categories).length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-2 border-t border-gray-300 pt-2">
                                {Object.entries(section.categories).map(([cat, skills]: [string, any], i, arr) => (
                                  Array.isArray(skills) && skills.length > 0 && (
                                    <div key={cat} className={i === 0 && arr.length > 1 ? 'md:border-r md:pr-8 border-gray-300' : ''}>
                                      <ul className="list-disc pl-6 space-y-1">
                                        {skills.map((s: string, si: number) => (
                                          <li key={si} className="text-gray-800 text-base leading-snug" style={{ fontFamily: previewTemplate.fonts?.body }}><span style={{ color: primaryColor }}>■</span> {s}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      ))}
                    </div>
                  );
                } else {
                  return null;
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}