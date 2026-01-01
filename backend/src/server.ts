import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// --- DATA TYPES ---
interface CVData {
  personalInfo: { fullName: string; email: string; phone: string; location: string };
  summary: string;
  experience: Array<{ role: string; company: string; duration: string; description: string }>;
  education: Array<{ school: string; degree: string; dates: string }>;
  skills: string[] | string;       // Technical Skills
  softSkills?: string[] | string;  // <--- NEW: Soft Skills
  projects: Array<{ name: string; description: string; link: string }>;
  certifications: Array<{ name: string; issuer: string; date: string }>;
  activities: Array<{ role: string; organization: string; description: string }>;
  templateId?: string;
  targetJob?: string;
}

// ==========================================
//  ROUTE 1: TRUTHFUL AI OPTIMIZER
// ==========================================
app.post('/enhance-text', async (req: Request, res: Response) => {
  try {
    const { text, section, context, jobDescription } = req.body;
    if (!genAI) return res.status(500).json({ error: 'Server missing Gemini API Key' });

    // 1. TRUTH GUARDRAIL
    const truthConstraints = `
      CRITICAL RULES:
      1. NO HALLUCINATIONS. Do not add skills/experience the user didn't mention.
      2. FACTUAL INTEGRITY. Polish existing content only.
    `;

    // 2. ATS STRATEGY
    const atsStrategy = jobDescription 
      ? `ATS STRATEGY: Prioritize skills found in this Job Description: "${jobDescription}".` 
      : `Focus on professional clarity.`;

    // 3. SECTION SPECIFIC RULES
    let specificRules = "";
    switch(section) {
      case 'experience':
      case 'projects':
      case 'activities':
        specificRules = `
          **RULES FOR BULLETS:**
          1. Use "XYZ" Formula (Accomplished X by doing Z).
          2. Start with Action Verbs.
          3. NO passive language ("Responsible for").
        `;
        break; 
      case 'summary':
        specificRules = `
          **RULES FOR SUMMARY:**
          1. Professional tone. Max 3-4 sentences.
        `;
        break; 
      case 'skills':
        specificRules = `
          **RULES FOR SKILLS (COMPACT FORMAT):**
          1. Group skills logically into categories (e.g., Languages, Tools).
          2. **CRITICAL FORMATTING:** Output EXACTLY like this:
             Category Name: Skill 1, Skill 2, Skill 3
             Category Name: Skill 1, Skill 2, Skill 3
          3. Use a new line for each category.
          4. Do NOT use bullet points.
          5. Capitalize skills correctly (java -> Java).
        `;
        break;
      case 'softSkills':
        specificRules = `
          **RULES FOR SOFT SKILLS:**
          1. Provide a comma-separated list of professional soft skills.
          2. Example: Communication, Critical Thinking, Leadership.
        `;
        break;
      default:
        specificRules = "Rewrite to be professional.";
    }

    const fullPrompt = `
      ${truthConstraints}
      ${atsStrategy}
      ${specificRules}
      CONTEXT: ${context || 'General'}
      USER DRAFT: "${text}"
      OUTPUT: Only the rewritten text.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(fullPrompt);
    res.json({ enhancedText: result.response.text().trim().replace(/^"|"$/g, '') });

  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Failed to connect to AI' });
  }
});

// ==========================================
//  ROUTE 2: PDF GENERATION (Updated for Soft Skills & Graduate Logic)
// ==========================================
const generateHTML = (data: CVData, templateId: string): string => {
  const { 
    personalInfo, summary, experience = [], education = [], 
    skills = [], softSkills = [], // <--- Destructure Soft Skills
    projects = [], activities = [], certifications = [] 
  } = data;
  
  let colors = { primary: '#000', secondary: '#444', accent: '#000' };
  let font = 'Helvetica, Arial, sans-serif';
  let headingStyle = 'text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #ddd;';
  
  // --- TEMPLATE STYLES ---
  switch(templateId) {
    case 'graduate':
      colors = { primary: '#1e293b', secondary: '#475569', accent: '#2563eb' };
      headingStyle = 'font-weight: bold; border-bottom: 2px solid #2563eb; color: #2563eb;';
      break;
    case 'tech':
      colors = { primary: '#111827', secondary: '#374151', accent: '#0f766e' };
      headingStyle = 'text-transform: uppercase; font-weight: bold; border-bottom: 2px solid #0f766e; color: #0f766e;';
      break;
    case 'government':
      font = '"Courier New", Courier, monospace';
      headingStyle = 'text-transform: uppercase; font-weight: bold; text-decoration: underline; border: none;';
      break;
    default:
      colors = { primary: '#000', secondary: '#333', accent: '#000' };
      headingStyle = 'text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #333;';
  }

  const cleanText = (text: string) => text.replace(/\*\*/g, '').replace(/\*/g, '');
  
  // --- HELPER 1: FORMAT TECHNICAL SKILLS (Bold Categories) ---
  let rawSkills = Array.isArray(skills) ? skills.join('\n') : skills;
  const formattedSkills = cleanText(rawSkills)
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => {
      if (line.includes(':')) {
        return line.replace(/(.*?):/, '<span style="font-weight:bold; color:' + colors.primary + '">$1:</span>');
      }
      return line; 
    })
    .join('<br/>');

  // --- HELPER 2: FORMAT SOFT SKILLS (Simple List) ---
  let rawSoftSkills = Array.isArray(softSkills) ? softSkills.join(', ') : softSkills;

  // --- HELPER 3: SECTION RENDERERS ---
  const renderExperience = () => experience.length > 0 ? `
      <h3>Experience</h3>
      ${experience.map(job => `
        <div class="item">
          <div class="item-header"><span>${job.role}</span><span class="date">${job.duration}</span></div>
          <div class="company">${job.company}</div>
          <p>${cleanText(job.description)}</p>
        </div>`).join('')}
  ` : '';

  const renderEducation = () => education.length > 0 ? `
      <h3>Education</h3>
      ${education.map(edu => `
        <div class="item">
          <div class="item-header"><span>${edu.school}</span><span class="date">${edu.dates}</span></div>
          <div>${edu.degree}</div>
        </div>`).join('')}
  ` : '';

  const renderProjects = () => projects.length > 0 ? `
      <h3>Projects</h3>
      ${projects.map(p => `
        <div class="item">
          <div class="item-header"><span>${p.name}</span><span class="date">${p.link}</span></div>
          <p>${cleanText(p.description)}</p>
        </div>`).join('')}
  ` : '';

  const renderSkills = () => formattedSkills ? `<h3>Technical Skills</h3><div class="skills-block">${formattedSkills}</div>` : '';
  
  // <--- NEW: SOFT SKILLS RENDERER
  const renderSoftSkills = () => rawSoftSkills ? `
      <h3>Soft Skills</h3>
      <div class="skills-block">${cleanText(rawSoftSkills)}</div>
  ` : '';

  const renderCerts = () => certifications.length > 0 ? `
      <h3>Certifications</h3>
      ${certifications.map(c => `
        <div class="item">
          <div class="item-header"><span>${c.name} - ${c.issuer}</span><span class="date">${c.date}</span></div>
        </div>`).join('')}
  ` : '';

  const renderActivities = () => activities.length > 0 ? `
      <h3>Activities</h3>
      ${activities.map(a => `
        <div class="item">
          <div class="item-header"><span>${a.role}</span><span class="date">${a.organization}</span></div>
          <p>${cleanText(a.description)}</p>
        </div>`).join('')}
  ` : '';

  // --- DYNAMIC ORDERING LOGIC ---
  let contentBody = '';
  
  if (templateId === 'graduate') {
    // GRADUATE ORDER: Education -> Tech Skills -> Soft Skills -> Projects -> Experience
    contentBody = `
      ${renderEducation()}
      ${renderSkills()}
      ${renderSoftSkills()}
      ${renderProjects()}
      ${renderExperience()}
      ${renderCerts()}
      ${renderActivities()}
    `;
  } else {
    // STANDARD ORDER: Tech Skills -> Soft Skills -> Experience -> Education -> Projects
    contentBody = `
      ${renderSkills()}
      ${renderSoftSkills()}
      ${renderExperience()}
      ${renderEducation()}
      ${renderProjects()}
      ${renderCerts()}
      ${renderActivities()}
    `;
  }

  return `
    <html>
      <head>
        <style>
          body { font-family: ${font}; color: #333; margin: 0; padding: 40px; font-size: 12px; line-height: 1.5; }
          h1 { font-size: 24px; margin: 0 0 5px 0; color: ${colors.primary}; }
          .contact { font-size: 11px; color: ${colors.secondary}; margin-bottom: 20px; }
          h3 { font-size: 14px; margin-top: 20px; margin-bottom: 10px; padding-bottom: 3px; ${headingStyle} }
          .item { margin-bottom: 12px; }
          .item-header { display: flex; justify-content: space-between; font-weight: bold; color: #000; }
          .company { font-size: 11px; font-weight: bold; color: ${colors.accent}; margin-bottom: 2px; }
          .date { white-space: nowrap; font-size: 11px; color: #666; font-weight: normal; }
          p { margin: 2px 0 0 0; white-space: pre-line; }
          .skills-block { margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div style="text-align: center;">
          <h1>${personalInfo.fullName}</h1>
          <div class="contact">
            ${personalInfo.location ? `${personalInfo.location} • ` : ''}
            ${personalInfo.phone ? `${personalInfo.phone} • ` : ''}
            ${personalInfo.email}
          </div>
        </div>

        ${summary ? `<h3>Professional Summary</h3><p>${summary}</p>` : ''}
        
        ${contentBody}

      </body>
    </html>
  `;
};

// Add '/api' to match the frontend
app.post('/api/generate-pdf', async (req: Request, res: Response) => {
  try {
    const cvData: CVData = req.body;
    const templateId = cvData.templateId || 'modern';
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const htmlContent = generateHTML(cvData, templateId);
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' } });
    await browser.close();
    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdfBuffer.length.toString() });
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));