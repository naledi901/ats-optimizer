import { useCV } from '../context/CVContext';
import { AIEnhanceButton } from './AIEnhanceButton';

const ActivitiesForm = () => {
  const { cvData, updateCVData } = useCV();

  const updateActivity = (index: number, field: string, value: string) => {
    const newActivities = [...cvData.activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    updateCVData('activities', newActivities);
  };

  const addActivity = () => {
    updateCVData('activities', [...cvData.activities, { role: '', organization: '', description: '' }]);
  };

  const removeActivity = (index: number) => {
    const newActivities = cvData.activities.filter((_, i) => i !== index);
    updateCVData('activities', newActivities);
  };

  return (
    <div className="space-y-6">
      {cvData.activities.map((act, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
          <button onClick={() => removeActivity(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">🗑️</button>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Role"
              value={act.role}
              onChange={(e) => updateActivity(index, 'role', e.target.value)}
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Organization"
              value={act.organization}
              onChange={(e) => updateActivity(index, 'organization', e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>

          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
            <AIEnhanceButton 
              textToEnhance={act.description}
              section="experience"
              context={`Role: ${act.role} at ${act.organization}`}
              onEnhance={(newText) => updateActivity(index, 'description', newText)}
            />
          </div>

          <textarea
            placeholder="What did you do?"
            value={act.description}
            onChange={(e) => updateActivity(index, 'description', e.target.value)}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
      <button onClick={addActivity} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500">+ Add Activity</button>
    </div>
  );
};

export default ActivitiesForm;