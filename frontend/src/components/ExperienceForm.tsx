import { useCV } from '../context/CVContext';
import { AIEnhanceButton } from './AIEnhanceButton';

const ExperienceForm = () => {
  const { cvData, updateCVData } = useCV();

  const updateExperience = (index: number, field: string, value: string) => {
    const newExperience = [...cvData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    updateCVData('experience', newExperience);
  };

  const addExperience = () => {
    updateCVData('experience', [...cvData.experience, { role: '', company: '', duration: '', description: '' }]);
  };

  const removeExperience = (index: number) => {
    const newExperience = cvData.experience.filter((_, i) => i !== index);
    updateCVData('experience', newExperience);
  };

  return (
    <div className="space-y-6">
      {cvData.experience.map((job, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
          <button 
            onClick={() => removeExperience(index)}
            className="absolute top-2 right-2 text-red-400 hover:text-red-600"
          >
            🗑️
          </button>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <input
              type="text"
              placeholder="Job Title"
              value={job.role}
              onChange={(e) => updateExperience(index, 'role', e.target.value)}
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Company"
              value={job.company}
              onChange={(e) => updateExperience(index, 'company', e.target.value)}
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Duration (e.g. Jan 2024 - Present)"
              value={job.duration}
              onChange={(e) => updateExperience(index, 'duration', e.target.value)}
              className="p-2 border rounded w-full col-span-2"
            />
          </div>

          {/* AI Button placed right above the description */}
          <div className="flex justify-between items-center mb-1 mt-4">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <AIEnhanceButton 
              textToEnhance={job.description}
              section="experience"
              context={`Role: ${job.role} at ${job.company}`}
              onEnhance={(newText) => updateExperience(index, 'description', newText)}
            />
          </div>

          <textarea
            value={job.description}
            onChange={(e) => updateExperience(index, 'description', e.target.value)}
            placeholder="• List your responsibilities..."
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        + Add Experience
      </button>
    </div>
  );
};

export default ExperienceForm;