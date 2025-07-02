import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Lock, Crown } from 'lucide-react';
import { getSkillsForIndustryAndLevel } from '../../lib/industry-skills';
import { useAuth } from '../../contexts/AuthContext';
import { trackUpgradePrompt, trackUpgradeClick } from '../../lib/ai-utils';

interface SkillsSuggestionsProps {
  selectedIndustry: string;
  experienceLevel: string;
  onAddSkill: (skill: string) => void;
  currentSkills: string;
  className?: string;
  onUpgradeClick?: () => void;
}

export default function SkillsSuggestions({
  selectedIndustry,
  experienceLevel,
  onAddSkill,
  currentSkills,
  className = '',
  onUpgradeClick
}: SkillsSuggestionsProps) {
  const [displayedSkills, setDisplayedSkills] = useState<string[]>([]);
  const { profile } = useAuth();
  const userTier = profile?.tier || 'free';

  // Get skills based on industry and experience level
  useEffect(() => {
    if (selectedIndustry && experienceLevel) {
      const allSkills = getSkillsForIndustryAndLevel(selectedIndustry, experienceLevel);
      setDisplayedSkills(allSkills);
    } else {
      setDisplayedSkills([]);
    }
  }, [selectedIndustry, experienceLevel]);

  // Tier-based skill limits
  const freeSkillsLimit = 8;
  const currentSkillsList = currentSkills ? currentSkills.split(',').map(s => s.trim().toLowerCase()) : [];
  const availableSkills = displayedSkills.filter(skill => 
    !currentSkillsList.includes(skill.toLowerCase())
  );

  // Apply tier restrictions
  const suggestedSkills = userTier === 'free' 
    ? availableSkills.slice(0, freeSkillsLimit)
    : availableSkills.slice(0, 12);
    
  const lockedSkillsCount = userTier === 'free' 
    ? Math.max(0, availableSkills.length - freeSkillsLimit)
    : 0;

  // Track upgrade prompt when locked skills are shown
  useEffect(() => {
    if (userTier === 'free' && lockedSkillsCount > 0 && selectedIndustry && experienceLevel) {
      trackUpgradePrompt('skills', {
        industry: selectedIndustry,
        experienceLevel: experienceLevel,
        lockedCount: lockedSkillsCount
      });
    }
  }, [userTier, lockedSkillsCount, selectedIndustry, experienceLevel]);

  // Don't show if no industry/level selected or no skills available
  if (!selectedIndustry || !experienceLevel || availableSkills.length === 0) {
    return null;
  }

  const handleUpgradeClick = () => {
    if (onUpgradeClick) {
      trackUpgradeClick('skills_locked', {
        industry: selectedIndustry,
        experienceLevel: experienceLevel,
        lockedCount: lockedSkillsCount
      });
      onUpgradeClick();
    }
  };

  const getIndustryDisplayName = (industry: string) => {
    const names: Record<string, string> = {
      technology: 'Technology',
      healthcare: 'Healthcare',
      finance: 'Finance',
      marketing: 'Marketing',
      engineering: 'Engineering',
      education: 'Education'
    };
    return names[industry] || industry.charAt(0).toUpperCase() + industry.slice(1);
  };

  const getExperienceLevelDisplayName = (level: string) => {
    const names: Record<string, string> = {
      entry: 'Entry Level',
      mid: 'Mid Level',
      senior: 'Senior Level'
    };
    return names[level] || level;
  };

  return (
    <div className={`skills-suggestions ${className}`}>
      <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-lg p-4 mt-4">
        <div className="suggestions-header-row">
          <h4 className="text-sm font-semibold text-blue-300 flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>Popular {getIndustryDisplayName(selectedIndustry)} Skills</span>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
              {getExperienceLevelDisplayName(experienceLevel)}
            </span>
          </h4>
          {userTier === 'free' && lockedSkillsCount > 0 && (
            <span className="skills-tier-badge">
              {suggestedSkills.length} of {availableSkills.length} skills
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {suggestedSkills.map((skill, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddSkill(skill);
              }}
              className="group flex items-center space-x-1.5 bg-white/5 hover:bg-blue-500/20 text-gray-300 hover:text-blue-200 text-sm py-2 px-3 rounded-full border border-white/20 hover:border-blue-500/40 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-3 w-3 text-blue-400 group-hover:text-blue-300" />
              <span>{skill}</span>
            </button>
          ))}
          
          {/* Show locked skills for free users */}
          {userTier === 'free' && lockedSkillsCount > 0 && onUpgradeClick && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUpgradeClick();
              }}
              className="skill-chip locked"
              title="Upgrade to Professional to unlock more skills"
            >
              <Lock className="h-3 w-3 mr-1" />
              +{lockedSkillsCount} more skills
            </button>
          )}
        </div>
        
        {/* Upgrade prompt for free users */}
        {userTier === 'free' && lockedSkillsCount > 0 && onUpgradeClick && (
          <div className="skills-upgrade-prompt">
            <p>Unlock {lockedSkillsCount} more professional {getIndustryDisplayName(selectedIndustry)} skills</p>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUpgradeClick();
              }}
              className="upgrade-btn-small"
            >
              Upgrade to Professional - $49 AUD
            </button>
          </div>
        )}
        
        {suggestedSkills.length === 0 && currentSkills && (
          <div className="text-center py-4">
            <p className="text-sm text-green-400">
              ✅ Great! You've added all the recommended {getIndustryDisplayName(selectedIndustry)} skills for your level.
            </p>
          </div>
        )}
        
        <div className="mt-3 flex items-start space-x-2 text-xs text-gray-400">
          <span>💡</span>
          <div>
            <p>Click skills to add them instantly. Skills are tailored for {getExperienceLevelDisplayName(experienceLevel)} professionals in {getIndustryDisplayName(selectedIndustry)}.</p>
            {userTier === 'paid' && availableSkills.length > 12 && (
              <p className="mt-1">
                More skills will appear automatically as you select these ones. Keep clicking to discover all {availableSkills.length} available skills!
              </p>
            )}
            {userTier === 'free' && lockedSkillsCount > 0 && (
              <p className="mt-1 text-purple-300">
                <Crown className="h-3 w-3 inline mr-1" />
                Professional tier includes access to {availableSkills.length} total skills for your level.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 