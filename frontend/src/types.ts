// frontend/src/types.ts

export interface CVContent {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    dates: string;
  }>;
  skills: string[] | string;
  softSkills: string[] | string; 
  projects: Array<{
    name: string;
    description: string;
    link: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  activities: Array<{
    role: string;
    organization: string;
    description: string;
  }>;
  // --- ADD THESE TWO LINES ---
  templateId?: string;
  targetJob?: string;
}