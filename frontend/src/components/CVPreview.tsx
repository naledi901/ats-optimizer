import { useCV } from '../context/CVContext';
import { templates } from '../templates/templateRegistry';

const CVPreview = () => {
  const { cvData } = useCV();
  
  const { 
    personalInfo = { fullName: '', email: '', phone: '', location: '' }, 
    summary = '', 
    experience = [], 
    education = [], 
    skills = [], 
    softSkills = [], 
    projects = [], 
    certifications = [], 
    activities = [],
    templateId = 'modern' 
  } = cvData;

  const config = templates[templateId] || templates.modern;
  const { colors, design } = config;

  const styles = {
    name: `text-3xl mb-1 ${design.boldName ? 'font-bold' : 'font-semibold'}`,
    heading: `text-xs font-bold mb-3 mt-6 pb-1 tracking-wider ${design.uppercaseHeadings ? 'uppercase' : ''} ${design.sectionLines ? 'border-b' : ''}`,
    subHeading: 'font-bold text-gray-900',
    meta: 'text-xs text-gray-600',
    body: 'text-sm leading-relaxed text-gray-700 whitespace-pre-line',
  };

  // --- SECTION BUILDERS ---

  const sectionSummary = summary && (
    <section>
      <h3 className={styles.heading} style={{ color: colors.accent, borderColor: colors.secondary }}>
        Professional Summary
      </h3>
      <p className={styles.body}>{summary}</p>
    </section>
  );

  const sectionSkills = (Array.isArray(skills) ? skills.length > 0 : skills) && (
    <section>
      <h3 className={styles.heading} style={{ color: colors.accent, borderColor: colors.secondary }}>
        Technical Skills
      </h3>
      <p className="text-sm text-gray-800">
        {Array.isArray(skills) ? skills.join(' • ') : skills}
      </p>
    </section>
  );

  const sectionSoftSkills = (Array.isArray(softSkills) ? softSkills.length > 0 : softSkills) && (
    <section>
      <h3 className={styles.heading} style={{ color: colors.accent, borderColor: colors.secondary }}>
        Soft Skills
      </h3>
      <p className="text-sm text-gray-800">
        {Array.isArray(softSkills) ? softSkills.join(' • ') : softSkills}
      </p>
    </section>
  );

  const sectionExperience = experience.length > 0 && (
    <section>
      <h3 className={styles.heading} style={{ color: colors.accent, borderColor: colors.secondary }}>
        Experience
      </h3>
      {experience.map((job, i) => (
        <div key={i} className="mb-4">
          <div className="flex justify-between items-baseline">
            <h4 className={styles.subHeading}>{job.role}</h4>
            <span className={styles.meta}>{job.duration}</span>
          </div>
          <div className="text-xs font-semibold mb-2" style={{ color: colors.accent }}>
            {job.company}
          </div>
          <p className={styles.body}>{job.description}</p>
        </div>
      ))}
    </section>
  );

  // 👇 UPDATED: Now renders the description (Coursework) correctly!
  const sectionEducation = education.length > 0 && (
    <section>
      <h3 className={styles.heading} style={{ color: colors.accent, borderColor: colors.secondary }}>
        Education
      </h3>
      {education.map((edu, i) => (
        <div key={i} className="mb-3">
          <div className="flex justify-between items-baseline">
            <h4 className={styles.subHeading}>{edu.school}</h4>
            <span className={styles.meta}>{edu.dates}</span>
          </div>
          <div className="text-sm font-semibold mb-1">{edu.degree}</div>
          
          {/* This part renders the Coursework if it exists */}
          {edu.description && (
            <p className="text-xs text-gray-600 whitespace-pre-line mt-1">
              {edu.description}
            </p>
          )}
        </div>
      ))}
    </section>
  );

  const sectionProjects = projects.length > 0 && (
    <section>
      <h3 className={styles.heading} style={{ color: colors.accent, borderColor: colors.secondary }}>
        Projects
      </h3>
      {projects.map((proj, i) => (
        <div key={i} className="mb-3">
          <div className="flex justify-between items-baseline">
            <h4 className={styles.subHeading}>{proj.name}</h4>
            {proj.link && <span className={styles.meta}>{proj.link}</span>}
          </div>
          <p className={styles.body}>{proj.description}</p>
        </div>
      ))}
    </section>
  );

  const sectionActivities = activities.length > 0 && (
    <section>
      <h3 className={styles.heading} style={{ color: colors.accent, borderColor: colors.secondary }}>
        Leadership & Activities
      </h3>
      {activities.map((act, i) => (
        <div key={i} className="mb-3">
          <div className="flex justify-between items-baseline">
            <h4 className={styles.subHeading}>{act.role}</h4>
            <span className={styles.meta}>{act.organization}</span>
          </div>
          <p className={styles.body}>{act.description}</p>
        </div>
      ))}
    </section>
  );

  const sectionCertifications = certifications.length > 0 && (
    <section>
      <h3 className={styles.heading} style={{ color: colors.accent, borderColor: colors.secondary }}>
        Certifications
      </h3>
      {certifications.map((cert, i) => (
        <div key={i} className="mb-2 flex justify-between text-sm">
           <span className="font-semibold">{cert.name} - {cert.issuer}</span>
           <span className="text-gray-500 text-xs">{cert.date}</span>
        </div>
      ))}
    </section>
  );

  return (
    <div className="bg-gray-100 p-4 rounded-xl h-full shadow-inner overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-gray-500 uppercase text-xs tracking-wider">
          Preview: {templateId.toUpperCase()}
        </h2>
        <div className="text-xs text-gray-400">ATS-Ready (Single Column)</div>
      </div>

      <div className="overflow-y-auto custom-scrollbar flex-1 relative bg-gray-300/50 rounded p-4">
        <div 
          className="bg-white shadow-2xl origin-top mx-auto p-[40px]"
          style={{ 
            width: '210mm', 
            minHeight: '297mm', 
            transform: 'scale(0.6)', 
            marginBottom: '-40%',
            fontFamily: config.layoutType === 'government' ? 'Courier New, monospace' : 'Arial, sans-serif'
          }}
        >
          {/* --- HEADER --- */}
          <header className="text-center mb-6">
            <h1 className={styles.name} style={{ color: colors.primary }}>
              {personalInfo.fullName || 'YOUR NAME'}
            </h1>
            <div className="text-sm flex justify-center gap-3 flex-wrap" style={{ color: colors.secondary }}>
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.email && <span>• {personalInfo.email}</span>}
            </div>
          </header>

          {/* --- DYNAMIC LAYOUT ORDERING --- */}
          {templateId === 'graduate' ? (
            // GRADUATE ORDER
            <>
              {sectionSummary}
              {sectionEducation}
              {sectionSkills}
              {sectionSoftSkills}
              {sectionProjects}
              {sectionExperience}
              {sectionActivities}
              {sectionCertifications}
            </>
          ) : (
            // STANDARD ORDER
            <>
              {sectionSummary}
              {sectionSkills}
              {sectionSoftSkills}
              {sectionExperience}
              {sectionEducation}
              {sectionProjects}
              {sectionActivities}
              {sectionCertifications}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default CVPreview;