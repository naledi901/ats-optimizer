import { CVProvider } from './context/CVContext';
import PersonalInfoForm from './components/PersonalInfoForm';
import SummaryForm from './components/SummaryForm';
import ExperienceForm from './components/ExperienceForm';
import EducationForm from './components/EducationForm';
import SkillsForm from './components/SkillsForm';
import ProjectsForm from './components/ProjectsForm';
import ActivitiesForm from './components/ActivitiesForm';
import CertificationsForm from './components/CertificationsForm';
import CVPreview from './components/CVPreview';
import TargetJobForm from './components/TargetJobForm';
import TemplateSelector from './components/TemplateSelector';
import DownloadButton from './components/DownloadButton';
import UserMenu from './components/UserMenu'; // <--- 1. NEW IMPORT

function App() {
  return (
    <CVProvider>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        
        {/* --- NEW HEADER SECTION --- */}
        <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            
            {/* Logo & Title */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                ATS Resume Optimizer
              </h1>
            </div>

            {/* Login Button / User Menu */}
            <UserMenu /> 
            
          </div>
        </header>

        {/* --- MAIN CONTENT (Your Existing Grid) --- */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* --- LEFT COLUMN: EDIT FORMS --- */}
            <div className="space-y-6 overflow-y-auto h-[calc(100vh-8rem)] pr-2 pb-20 scrollbar-hide">
              
              {/* 1. Target Job Form (ATS Optimizer) */}
              <TargetJobForm />

              {/* 2. Template Selector */}
              <TemplateSelector />

              {/* 3. Personal Information */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>👤</span> Personal Information
                </h2>
                <PersonalInfoForm />
              </div>

              {/* 4. Professional Summary */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">📝 Professional Summary</h2>
                <SummaryForm />
              </div>

              {/* 5. Experience */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">💼 Experience</h2>
                <ExperienceForm />
              </div>

              {/* 6. Education */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">🎓 Education</h2>
                <EducationForm />
              </div>

              {/* 7. Skills */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">🛠️ Skills</h2>
                <SkillsForm />
              </div>

              {/* 8. Projects */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">🚀 Projects</h2>
                <ProjectsForm />
              </div>

              {/* 9. Certifications */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">🏆 Certifications</h2>
                <CertificationsForm />
              </div>

              {/* 10. Activities */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">🤝 Activities</h2>
                <ActivitiesForm />
              </div>
            </div>

            {/* --- RIGHT COLUMN: PREVIEW & DOWNLOAD --- */}
            <div className="lg:sticky lg:top-24 h-[calc(100vh-8rem)] flex flex-col gap-4">
                
                {/* Download Button Section */}
                <div className="flex justify-end">
                  <DownloadButton />
                </div>

                {/* Live Preview Component */}
                <CVPreview />
            </div>

          </div>
        </div>
      </div>
    </CVProvider>
  );
}

export default App;