import React from 'react';
import { useCV } from '../context/CVContext';
import { AIEnhanceButton } from './AIEnhanceButton';

const SkillsForm = () => {
  const { cvData, updateCVData } = useCV();

  // Helper to safely convert array/string to string for the Textarea
  const getDisplayValue = (val: string[] | string | undefined): string => {
    if (!val) return '';
    if (Array.isArray(val)) return val.join('\n'); // Display arrays as new lines
    return val;
  };

  // 1. Handle Technical Skills
  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCVData('skills', e.target.value);
  };

  // 2. Handle Soft Skills
  const handleSoftSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCVData('softSkills', e.target.value);
  };

  return (
    <div className="space-y-8">
      
      {/* --- SECTION 1: TECHNICAL SKILLS --- */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            Technical Skills (Hard Skills)
          </label>
          
          <AIEnhanceButton 
            textToEnhance={getDisplayValue(cvData.skills)}
            section="skills" 
            context="Group into categories (e.g. Languages, Tools) with bold headers."
            onEnhance={(newText) => updateCVData('skills', newText)}
          />
        </div>
        
        <p className="text-xs text-gray-500 mb-2">
          Tip: Use the format "Category: Skill 1, Skill 2" for the best layout.
        </p>

        <textarea
          value={getDisplayValue(cvData.skills)}
          onChange={handleSkillsChange}
          placeholder="Languages: Java, Python&#10;Tools: Git, Docker, Jira"
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
        />
      </div>

      {/* --- SECTION 2: SOFT SKILLS (NEW) --- */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            Soft Skills (Personal Attributes)
          </label>
          
          <AIEnhanceButton 
            textToEnhance={getDisplayValue(cvData.softSkills)}
            section="softSkills" 
            context="List as professional comma-separated attributes."
            onEnhance={(newText) => updateCVData('softSkills', newText)}
          />
        </div>
        
        <p className="text-xs text-gray-500 mb-2">
          List your key strengths (e.g., Communication, Leadership).
        </p>

        <textarea
          value={getDisplayValue(cvData.softSkills)}
          onChange={handleSoftSkillsChange}
          placeholder="Communication, Critical Thinking, Adaptability, Team Leadership..."
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

    </div>
  );
};

export default SkillsForm;