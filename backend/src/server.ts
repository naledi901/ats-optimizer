import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from './firebaseAdmin'; 

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// --- DATA TYPES ---
interface CVData {
  personalInfo: { fullName: string; email: string; phone: string; location: string };
  summary: string;
  experience: Array<{ role: string; company: string; duration: string; description: string }>;
  // UPDATED: Added 'description' (optional) for Coursework
  education: Array<{ school: string; degree: string; dates: string; description?: string }>;
  skills: string[] | string;
  softSkills?: string[] | string;
  projects: Array<{ name: string; description: string; link: string }>;
  certifications: Array<{ name: string; issuer: string; date: string }>;
  activities: Array<{ role: string; organization: string; description: string }>;
  templateId?: string;
  targetJob?: string;
}

// ==========================================
//  ROUTE 1: TRUTHFUL AI OPTIMIZER (With Usage Limit & Expiration Check)
// ==========================================
app.post('/enhance-text', async (req: Request, res: Response) => {
  try {
    // 1. GET USER ID FROM FRONTEND
    const { text, section, context, jobDescription, userId } = req.body; 
    
    // Guardrail: Must be logged in
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!genAI) return res.status(500).json({ error: 'Server missing Gemini API Key' });

    // 2. CHECK DATABASE (The Bouncer) 👮‍♂️
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    // If user is new, create them
    if (!userDoc.exists) {
      await userRef.set({ 
        email: 'user@email.com', 
        aiUsageCount: 0, 
        isPremium: false 
      });
    }

    const userData = userDoc.exists ? userDoc.data() : { aiUsageCount: 0, isPremium: false };

    // --- NEW: EXPIRATION CHECK ⏳ ---
    let hasActivePremium = false;
    
    // Only check expiration if they are marked as premium
    if (userData?.isPremium && userData?.premiumExpiresAt) {
      const expiryDate = new Date(userData.premiumExpiresAt);
      const now = new Date();
      
      if (now < expiryDate) {
        hasActivePremium = true; // Still valid!
      } else {
        console.log(`⚠️ User ${userId} premium expired on ${expiryDate}`);
        // We treat them as free user (hasActivePremium remains false)
      }
    }
    // -------------------------------

    // 3. THE LIMIT CHECK
    // Block if: (NOT Active Premium) AND (Count >= 10)
    // Note: If their premium expired, hasActivePremium is false, so this check runs.
    if (!hasActivePremium && (userData?.aiUsageCount || 0) >= 10) {
      console.log(`🚫 User ${userId} blocked. Usage: ${userData?.aiUsageCount}`);
      return res.status(403).json({ 
        error: 'LIMIT_REACHED', 
        message: 'Your 30-Day Pass has expired (or you reached the free limit). Please renew to continue.' 
      });
    }

    // 4. PERFORM AI GENERATION
    const truthConstraints = `
      CRITICAL RULES:
      1. NO HALLUCINATIONS. Do not add skills/experience the user didn't mention.
      2. FACTUAL INTEGRITY. Polish existing content only.
    `;

    const atsStrategy = jobDescription 
      ? `ATS STRATEGY: Prioritize skills found in this Job Description: "${jobDescription}".` 
      : `Focus on professional clarity.`;

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
    
    // 5. UPDATE THE COUNTER (Success!) 📈
    await userRef.update({
      aiUsageCount: (userData?.aiUsageCount || 0) + 1
    });

    res.json({ enhancedText: result.response.text().trim().replace(/^"|"$/g, '') });

  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Failed to connect to AI' });
  }
});

// ==========================================
//  ROUTE 2: PDF GENERATION
// ==========================================
const generateHTML = (data: CVData, templateId: string): string => {
  const { 
    personalInfo, summary, experience = [], education = [], 
    skills = [], softSkills = [],
    projects = [], activities = [], certifications = [] 
  } = data;
  
  let colors = { primary: '#000', secondary: '#444', accent: '#000' };
  let font = 'Helvetica, Arial, sans-serif';
  let headingStyle = 'text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #ddd;';
  
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

  let rawSoftSkills = Array.isArray(softSkills) ? softSkills.join(', ') : softSkills;

  const renderExperience = () => experience.length > 0 ? `
      <h3>Experience</h3>
      ${experience.map(job => `
        <div class="item">
          <div class="item-header"><span>${job.role}</span><span class="date">${job.duration}</span></div>
          <div class="company">${job.company}</div>
          <p>${cleanText(job.description)}</p>
        </div>`).join('')}
  ` : '';

  // UPDATED: Education now renders the description (Coursework)
  const renderEducation = () => education.length > 0 ? `
      <h3>Education</h3>
      ${education.map(edu => `
        <div class="item">
          <div class="item-header"><span>${edu.school}</span><span class="date">${edu.dates}</span></div>
          <div style="font-weight: bold; margin-bottom: 2px;">${edu.degree}</div>
          ${edu.description ? `<p style="margin-top: 4px; font-size: 11px; color: #444;">${cleanText(edu.description)}</p>` : ''}
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

  let contentBody = '';
  
  if (templateId === 'graduate') {
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

app.post('/generate-pdf', async (req: Request, res: Response) => {
  try {
    const cvData: CVData = req.body;
    const templateId = cvData.templateId || 'modern';
    
    // UPDATED CONFIG: Robust Arguments for Render/Cloud
    // ".puppeteerrc.cjs" handles the cache directory
    const browser = await puppeteer.launch({ 
      headless: true, 
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Critical for preventing crashes on Render
        '--single-process',        // Critical for low-memory environments
        '--no-zygote'              // Prevents zombie processes
      ],
    });

    const page = await browser.newPage();
    const htmlContent = generateHTML(cvData, templateId);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ 
      format: 'A4', 
      printBackground: true, 
      margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' } 
    });
    
    await browser.close();
    
    res.set({ 
      'Content-Type': 'application/pdf', 
      'Content-Length': pdfBuffer.length.toString() 
    });
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// ==========================================
//  ROUTE 3: UPGRADE USER (30-DAY PASS) 🗓️
// ==========================================
app.post('/upgrade-user', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // 1. CALCULATE EXPIRATION DATE (Now + 30 Days)
    const now = new Date();
    const thirtyDaysLater = new Date(now);
    thirtyDaysLater.setDate(now.getDate() + 30); // <--- Add 30 Days

    // 2. UPDATE DATABASE
    await db.collection('users').doc(userId).update({
      isPremium: true,
      aiUsageCount: 0, // Reset count
      premiumSince: now.toISOString(),
      premiumExpiresAt: thirtyDaysLater.toISOString() // <--- Save Expiry!
    });

    console.log(`💎 User ${userId} upgraded until ${thirtyDaysLater.toISOString()}`);
    res.json({ success: true, message: 'User upgraded for 30 days' });

  } catch (error) {
    console.error('Upgrade Error:', error);
    res.status(500).json({ error: 'Failed to upgrade user' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));