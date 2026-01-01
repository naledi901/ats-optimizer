import type { CVContent } from '../types';

export const initialCV: CVContent = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  softSkills: [],
  projects: [],
  // --- THESE WERE MISSING ---
  certifications: [],
  activities: [],
  templateId: 'modern',
  targetJob: ''
};