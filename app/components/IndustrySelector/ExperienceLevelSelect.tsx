import React from 'react';
import { Crown } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface ExperienceLevelSelectProps {
  selectedLevel: string;
  onLevelSelect: (level: string) => void;
  selectedIndustry: string;
  fieldStatus?: 'success' | 'error' | null;
  onUpgradeClick?: () => void;
}

export const experienceLevels = [
  {
    id: 'entry',
    name: 'Entry Level',
    description: '0-2 years experience, recent graduate, career changer',
    icon: '🌱'
  },
  {
    id: 'mid',
    name: 'Mid Level', 
    description: '3-7 years experience, established professional',
    icon: '📈'
  },
  {
    id: 'senior',
    name: 'Senior Level',
    description: '8+ years experience, leadership roles, industry expert',
    icon: '👑'
  }
];

export const experienceLevelContexts = {
  entry: `
    - Focus on potential, learning ability, and educational achievements
    - Emphasize internships, projects, volunteer work, and relevant coursework
    - Highlight transferable skills and enthusiasm for the industry
    - Use language that shows eagerness to learn and contribute
    - Include technical skills gained through education or self-learning
    - Keep achievements realistic for someone starting their career
  `,
  
  mid: `
    - Focus on proven track record and career progression
    - Emphasize specific achievements and measurable results
    - Show increasing responsibility and project leadership
    - Include professional development and specialized skills
    - Demonstrate industry knowledge and best practices
    - Balance technical skills with soft skills and collaboration
  `,
  
  senior: `
    - Focus on leadership, strategy, and industry expertise
    - Emphasize team management, mentoring, and organizational impact
    - Include high-level achievements and business results
    - Show thought leadership, industry recognition, and innovation
    - Demonstrate strategic thinking and decision-making abilities
    - Include speaking, teaching, or industry contribution experiences
  `
};

export const getLevelGuidance = (experienceLevel: string) => {
  switch (experienceLevel) {
    case 'entry':
      return "Focus on your education, projects, and enthusiasm. Include internships and relevant coursework.";
    case 'mid':
      return "Highlight your career progression and specific achievements. Show increasing responsibility.";
    case 'senior':
      return "Emphasize leadership, strategic impact, and industry expertise. Include mentoring and team management.";
    default:
      return "Select your experience level for personalized guidance.";
  }
};

const ExperienceLevelSelect: React.FC<ExperienceLevelSelectProps> = ({
  selectedLevel,
  onLevelSelect,
  selectedIndustry,
  fieldStatus,
  onUpgradeClick
}) => {
  const { profile } = useAuth();
  const userTier = profile?.tier || 'free';

  return (
    <div className="relative">
      <select 
        value={selectedLevel} 
        onChange={(e) => onLevelSelect(e.target.value)}
        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
          fieldStatus === 'success' ? 'border-green-400' : 'border-white/20'
        }`}
      >
        <option value="" className="bg-gray-800 text-gray-300">
          Select your experience level...
        </option>
        {experienceLevels.map(level => (
          <option key={level.id} value={level.id} className="bg-gray-800 text-white">
            {level.icon} {level.name} - {level.description}
          </option>
        ))}
      </select>
      
      {selectedLevel && (
        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-200 font-medium mb-1">
            💡 Guidance for {experienceLevels.find(l => l.id === selectedLevel)?.name}:
          </p>
          <p className="text-xs text-blue-300">
            {getLevelGuidance(selectedLevel)}
          </p>
        </div>
      )}
      
      {/* Show tier value after selection for free users */}
      {selectedLevel && userTier === 'free' && onUpgradeClick && (
        <div className="level-tier-hint">
          <div className="flex items-center space-x-2 text-xs text-gray-300">
            <Crown className="h-3 w-3 text-purple-400" />
            <span>
              Professional tier includes advanced {experienceLevels.find(l => l.id === selectedLevel)?.name.toLowerCase()}-level content and templates
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceLevelSelect; 