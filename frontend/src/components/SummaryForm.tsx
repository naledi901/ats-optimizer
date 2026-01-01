import { useCV } from '../context/CVContext';
import { AIEnhanceButton } from './AIEnhanceButton';

const SummaryForm = () => {
  const { cvData, updateCVData } = useCV();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">Professional Profile</label>
        
        {/* The Magic Button */}
        <AIEnhanceButton 
          textToEnhance={cvData.summary}
          section="summary"
          onEnhance={(newText) => updateCVData('summary', newText)}
        />
      </div>
      
      <textarea
        value={cvData.summary}
        onChange={(e) => updateCVData('summary', e.target.value)}
        placeholder="Draft your summary here (e.g., 'I am a final year ICT student...')"
        rows={6}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
      />
    </div>
  );
};

export default SummaryForm;