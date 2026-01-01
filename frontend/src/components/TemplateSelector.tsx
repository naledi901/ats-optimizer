import { useCV } from '../context/CVContext';
import { templates } from '../templates/templateRegistry';

const TemplateSelector = () => {
  const { cvData, updateCVData } = useCV();

  // Helper to get nice labels for the keys
  const getLabel = (key: string) => {
    switch(key) {
      case 'modern': return '📄 Modern';
      case 'graduate': return '🎓 Graduate';
      case 'tech': return '💻 Tech';
      case 'government': return '🏛️ Government';
      default: return key;
    }
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
        ATS-Optimized Templates
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.keys(templates).map((key) => {
           // Basic colors for preview dots
           const color = templates[key].colors.accent;
           const isSelected = cvData.templateId === key;

           return (
            <button
              key={key}
              onClick={() => updateCVData('templateId', key)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 text-blue-900' 
                  : 'border-gray-100 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <div 
                className="w-4 h-4 rounded-full mb-2 border border-gray-300 shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-semibold capitalize">
                {getLabel(key).split(' ')[1]} {/* Just show the name */}
              </span>
            </button>
           );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;