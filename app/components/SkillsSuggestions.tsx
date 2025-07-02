import React from 'react';
import { Plus, X } from 'lucide-react';

interface SkillsSuggestionsProps {
  suggestedSkills: string[];
  onAddSkill: (skill: string) => void;
  onClearSuggestions: () => void;
  selectedIndustry?: string;
  className?: string;
}

export default function SkillsSuggestions({
  suggestedSkills,
  onAddSkill,
  onClearSuggestions,
  selectedIndustry,
  className = ''
}: SkillsSuggestionsProps) {
  if (suggestedSkills.length === 0) {
    return null;
  }

  return (
    <div className={`skills-suggestions ${className}`}>
      <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-lg p-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-blue-300 flex items-center space-x-2">
            <span>✨ Suggested Skills</span>
            {selectedIndustry && (
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                {selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1)}
              </span>
            )}
          </h4>
          <button
            onClick={onClearSuggestions}
            className="text-gray-400 hover:text-gray-300 transition-colors"
            title="Clear suggestions"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {suggestedSkills.map((skill, index) => (
            <button
              key={index}
              onClick={() => onAddSkill(skill)}
              className="group flex items-center space-x-1.5 bg-white/5 hover:bg-blue-500/20 text-gray-300 hover:text-blue-200 text-sm py-2 px-3 rounded-full border border-white/20 hover:border-blue-500/40 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-3 w-3 text-blue-400 group-hover:text-blue-300" />
              <span>{skill}</span>
            </button>
          ))}
        </div>
        
        <p className="text-xs text-gray-400 mt-3 flex items-center space-x-1">
          <span>💡</span>
          <span>Click on skills to add them to your resume. You can edit them after adding.</span>
        </p>
      </div>
    </div>
  );
} 