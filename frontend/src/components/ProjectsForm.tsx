import { useCV } from '../context/CVContext';
import { AIEnhanceButton } from './AIEnhanceButton';

const ProjectsForm = () => {
  const { cvData, updateCVData } = useCV();

  const updateProject = (index: number, field: string, value: string) => {
    const newProjects = [...cvData.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    updateCVData('projects', newProjects);
  };

  const addProject = () => {
    updateCVData('projects', [...cvData.projects, { name: '', description: '', link: '' }]);
  };

  const removeProject = (index: number) => {
    const newProjects = cvData.projects.filter((_, i) => i !== index);
    updateCVData('projects', newProjects);
  };

  return (
    <div className="space-y-6">
      {cvData.projects.map((project, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
          <button onClick={() => removeProject(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">🗑️</button>

          <div className="grid grid-cols-1 gap-3 mb-3">
            <input
              type="text"
              placeholder="Project Name"
              value={project.name}
              onChange={(e) => updateProject(index, 'name', e.target.value)}
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Link (GitHub / Live URL)"
              value={project.link}
              onChange={(e) => updateProject(index, 'link', e.target.value)}
              className="p-2 border rounded w-full text-sm"
            />
          </div>

          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
            <AIEnhanceButton 
              textToEnhance={project.description}
              section="experience" // We use 'experience' mode for bullet points
              context={`Project: ${project.name}`}
              onEnhance={(newText) => updateProject(index, 'description', newText)}
            />
          </div>

          <textarea
            placeholder="Describe what you built..."
            value={project.description}
            onChange={(e) => updateProject(index, 'description', e.target.value)}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
      <button onClick={addProject} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500">+ Add Project</button>
    </div>
  );
};

export default ProjectsForm;