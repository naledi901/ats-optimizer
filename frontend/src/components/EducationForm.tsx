import { useCV } from '../context/CVContext';

const EducationForm = () => {
  const { cvData, updateCVData } = useCV();

  const addEducation = () => {
    updateCVData('education', [
      ...(cvData.education || []),
      { school: '', degree: '', dates: '', description: '' }
    ]);
  };

  const removeEducation = (index: number) => {
    const newEdu = [...(cvData.education || [])];
    newEdu.splice(index, 1);
    updateCVData('education', newEdu);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...(cvData.education || [])];
    // @ts-ignore
    newEdu[index] = { ...newEdu[index], [field]: value };
    updateCVData('education', newEdu);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Education</h2>
      </div>

      {cvData.education?.map((edu, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">School #{index + 1}</h3>
            <button onClick={() => removeEducation(index)} className="text-red-500 text-sm hover:underline">
              Remove
            </button>
          </div>

          <div className="space-y-4">
            {/* School Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Institution Name</label>
              <input
                type="text"
                placeholder="e.g. Walter Sisulu University"
                value={edu.school}
                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Degree */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Degree / Qualification</label>
              <input
                type="text"
                placeholder="e.g. Diploma in ICT"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Dates */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dates Attended</label>
              <input
                type="text"
                placeholder="e.g. Jan 2020 - Dec 2023"
                value={edu.dates}
                onChange={(e) => updateEducation(index, 'dates', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* NEW: Description / Coursework Field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Description / Relevant Coursework (Optional)
              </label>
              <textarea
                placeholder={`Example:\nRelevant Coursework:\nData Structures & Algorithms, Software Engineering, Database Systems, Web Development, Operating Systems`}
                value={edu.description || ''}
                // @ts-ignore
                onChange={(e) => updateEducation(index, 'description', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none h-28 text-sm leading-relaxed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Tip: List your modules here to show technical knowledge.
              </p>
            </div>

          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        + Add Education
      </button>
    </div>
  );
};

export default EducationForm;