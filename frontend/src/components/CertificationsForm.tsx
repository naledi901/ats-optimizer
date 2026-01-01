import { useCV } from '../context/CVContext';

const CertificationsForm = () => {
  const { cvData, updateCVData } = useCV();

  const addCert = () => {
    updateCVData('certifications', [
      ...(cvData.certifications || []),
      { name: '', issuer: '', date: '' }
    ]);
  };

  const removeCert = (index: number) => {
    const newList = [...(cvData.certifications || [])];
    newList.splice(index, 1);
    updateCVData('certifications', newList);
  };

  const updateCert = (index: number, field: string, value: string) => {
    const newList = [...(cvData.certifications || [])];
    newList[index] = { ...newList[index], [field]: value };
    updateCVData('certifications', newList);
  };

  return (
    <div className="space-y-4">
      {(cvData.certifications || []).map((cert, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 text-sm">Certificate #{index + 1}</h3>
            <button onClick={() => removeCert(index)} className="text-red-500 text-xs hover:underline">Remove</button>
          </div>
          
          <input
            type="text"
            placeholder="Certificate Name (e.g. AWS Cloud Practitioner)"
            value={cert.name}
            onChange={(e) => updateCert(index, 'name', e.target.value)}
            className="w-full p-2 border rounded text-sm"
          />
          
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Issuer (e.g. Amazon)"
              value={cert.issuer}
              onChange={(e) => updateCert(index, 'issuer', e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
            <input
              type="text"
              placeholder="Date (e.g. 2023)"
              value={cert.date}
              onChange={(e) => updateCert(index, 'date', e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addCert}
        className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500 text-sm font-bold"
      >
        + Add Certification
      </button>
    </div>
  );
};

export default CertificationsForm;