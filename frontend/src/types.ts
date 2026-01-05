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
  
  // 👇 FIXED: Added description so you can type Coursework
  education: Array<{
    school: string;
    degree: string;
    dates: string;
    description?: string; 
  }>;

  skills: string[] | string;
  softSkills?: string[] | string; 
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
  templateId?: string;
  targetJob?: string;
  
  // Optional backend fields (keeps TypeScript happy)
  aiUsageCount?: number;
  isPremium?: boolean;
}