import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import { industries } from '../../../data/industry-data';

interface IndustryDropdownProps {
  userTier: 'free' | 'paid';
  onIndustrySelect: (industryId: string) => void;
  selectedIndustry: string;
  onUpgradeClick: () => void;
  fieldStatus?: 'success' | 'error' | 'default';
}

const IndustryDropdown: React.FC<IndustryDropdownProps> = ({
  userTier,
  onIndustrySelect,
  selectedIndustry,
  onUpgradeClick,
  fieldStatus = 'default'
}) => {
  const availableIndustries = industries.filter(industry => 
    userTier === 'paid' || industry.availableInFreeTier
  );
  
  const lockedIndustries = industries.filter(industry => 
    userTier === 'free' && !industry.availableInFreeTier
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'upgrade') {
      onUpgradeClick();
    } else {
      onIndustrySelect(e.target.value);
    }
  };

  return (
    <div className="relative">
      <select 
        value={selectedIndustry} 
        onChange={handleSelectChange}
        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer ${
          fieldStatus === 'success' ? 'border-green-400' : 'border-white/20'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em'
        }}
      >
        <option value="" className="bg-gray-800 text-white">
          Select your industry...
        </option>
        
        {availableIndustries.map(industry => (
          <option 
            key={industry.id} 
            value={industry.id}
            className="bg-gray-800 text-white py-2"
          >
            {industry.name}
          </option>
        ))}
        
        {userTier === 'free' && lockedIndustries.length > 0 && (
          <option 
            value="upgrade" 
            className="bg-gray-700 text-yellow-300 py-2"
          >
            🔒 Unlock {lockedIndustries.length} more industries (Upgrade)
          </option>
        )}
      </select>
      
      {fieldStatus === 'success' && (
        <CheckCircle className="absolute right-8 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400 pointer-events-none" />
      )}
    </div>
  );
};

export default IndustryDropdown; 