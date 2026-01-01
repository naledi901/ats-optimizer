import { useCV } from '../context/CVContext';

const PersonalInfoForm = () => {
  const { cvData, updateCVData } = useCV();

  const handleChange = (field: string, value: string) => {
    updateCVData('personalInfo', {
      ...cvData.personalInfo,
      [field]: value
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Personal Information</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
          <input
            type="text"
            value={cvData.personalInfo.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Naledi Radebe"
          />
        </div>

        {/* Email & Phone Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
            <input
              type="email"
              value={cvData.personalInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
            <input
              type="text"
              value={cvData.personalInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+27 82 123 4567"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
          <input
            type="text"
            value={cvData.personalInfo.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Johannesburg, South Africa"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;