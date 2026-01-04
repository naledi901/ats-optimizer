import React from 'react';
// Note: We use ".." to go up one level out of components folder
import { CVProvider } from '../context/CVContext'; 

// Note: These correspond to files in the same folder now, so we remove "/components"
import PersonalInfoForm from './PersonalInfoForm';
import SummaryForm from './SummaryForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import ProjectsForm from './ProjectsForm';
import ActivitiesForm from './ActivitiesForm';
import CertificationsForm from './CertificationsForm';
import CVPreview from './CVPreview';
import TargetJobForm from './TargetJobForm';
import TemplateSelector from './TemplateSelector';
import DownloadButton from './DownloadButton';
import UserMenu from './UserMenu'; 

const Editor = () => {
  return (
    <CVProvider>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        
        {/* --- HEADER SECTION --- */}
        <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            
            {/* Logo & Title */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                ATS Optimizer
              </h1>
            </div>

            {/* Login Button / User Menu */}
            <UserMenu /> 
            
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* --- LEFT COLUMN: EDIT FORMS --- */}
            <div className="space-y-6 overflow-y-auto h-[calc(100vh-8rem)] pr-2 pb-20 scrollbar-hide">
              <TargetJobForm />
              <TemplateSelector />

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>👤</span> Personal Information
                </h2>
                <PersonalInfoForm />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">📝 Professional Summary</h2>
                <SummaryForm />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">💼 Experience</h2>
                <ExperienceForm />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">🎓 Education</h2>
                <EducationForm />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">🛠️ Skills</h2>
                <SkillsForm />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">🚀 Projects</h2>
                <ProjectsForm />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">🏆 Certifications</h2>
                <CertificationsForm />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">🤝 Activities</h2>
                <ActivitiesForm />
              </div>
            </div>

            {/* --- RIGHT COLUMN: PREVIEW & DOWNLOAD --- */}
            <div className="lg:sticky lg:top-24 h-[calc(100vh-8rem)] flex flex-col gap-4">
                <div className="flex justify-end">
                  <DownloadButton />
                </div>
                <CVPreview />
            </div>

          </div>
        </div>
      </div>
    </CVProvider>
  );
}

export default Editor;