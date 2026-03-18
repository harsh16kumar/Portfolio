// Central place for all portfolio structured data used by the chatbot.
// Fill these arrays/fields with your own information.

export const education = [
  {
    degree: 'B.Tech in Computer Science and Engineering',
    institution: 'Vellore Institute of Technology, Vellore, India',
    startYear: 2022,
    endYear: 'Present',
    details: 'CGPA: 9.11. Relevant coursework includes Data Structures, Object-Oriented Programming, Operating Systems, DBMS, Generative AI, and Natural Language Processing.'
  }
];

export const experience = [
  {
    role: 'AI Software Engineer Intern',
    company: 'Connectify Networking Pvt. Ltd.',
    period: 'Nov 2025 – Present',
    technologies: ['Agentic AI', 'n8n', 'Google Gemini', 'MongoDB', 'REST APIs'],
    highlights: [
      'Engineered Agentic AI workflows using n8n and Google Gemini to automate facility management, reducing operational overhead by 25%',
      'Developed scalable data pipelines using MongoDB and REST APIs to process 10k+ daily operational metrics for real-time facility insights'
    ],
  },
  {
    role: 'Software Development Intern',
    company: 'Wipro Ltd.',
    period: 'May 2025 – Jul 2025',
    technologies: ['Doxis CSB', 'Enterprise Content Management', 'Agentic AI'],
    highlights: [
      'Deployed intelligent document processing using Doxis CSB, reducing manual data classification time by 40%',
      'Designed Agentic AI architectures for Enterprise Content Management systems while completing 4 global certifications'
    ],
  }
];

export const projects = [
  {
    name: 'Agentic AI Facility Operations Manager',
    description: 'Automation platform that autonomously monitors facility health and handles operational workflows using AI agents.',
    techStack: ['n8n', 'Google Gemini', 'WhatsApp API', 'MongoDB', 'RAG'],
    link: '',
    highlights: [
      'Built an end-to-end automation system eliminating 100% of manual monitoring tasks via scheduled AI agents',
      'Implemented RAG-based context-aware query responses through a WhatsApp interface achieving 95% automated query resolution'
    ],
  },
  {
    name: 'Smart AI Resume Builder',
    description: 'LLM-powered system that automatically tailors developer resumes to job descriptions using GitHub metadata.',
    techStack: ['Python', 'Groq LLMs', 'LangChain', 'GitHub API', 'Vector Databases'],
    link: '',
    highlights: [
      'Built an AI engine that scrapes GitHub metadata to align projects with job descriptions, improving ATS match scores above 90%',
      'Implemented vector similarity search to match developer skills with job requirements, reducing resume customization time from hours to seconds'
    ],
  },
  {
    name: 'Real-time Parking Detection',
    description: 'Computer vision system that detects available parking spaces in real-time.',
    techStack: ['Python', 'OpenCV', 'Deep Learning'],
    link: '',
    highlights: [
      'Implemented background subtraction and contour detection to detect vacant parking spots with improved accuracy in low-light conditions',
      'Optimized inference pipeline for real-time processing on edge devices'
    ],
  }
];

export const achievements = [
  'Solved 400+ problems on LeetCode, across DSA, Graphs, and Dynamic Programming',
  'Production Head for award-winning theatre productions at Saarang (2nd Position) and Festember (1st Position)',
  'Completed 50+ end-to-end data analytics projects on DataWars focusing on feature engineering and predictive modeling'
];

export const skills = [
  'Agentic AI & Generative AI',
  'LangChain & LangGraph',
  'Natural Language Processing',
  'Deep Learning & TensorFlow',
  'Hugging Face Transformers',
  'Vector Databases & FAISS',
  'Python, C++, JavaScript, SQL',
  'MongoDB & PostgreSQL',
  'n8n Workflow Automation',
  'REST APIs & Backend Integration',
  'OpenCV Computer Vision',
  'Docker & Cloud-based ML workflows'
];

// Helper that turns these into a single string summary for the system prompt.
export function buildProfileSummary() {
  const sections = [];

  if (education.length) {
    sections.push(
      'Education:\n' +
        education
          .map(
            (e) =>
              `- ${e.degree} at ${e.institution} (${e.startYear}–${e.endYear})` +
              (e.details ? ` — ${e.details}` : '')
          )
          .join('\n')
    );
  }

  if (experience.length) {
    sections.push(
      'Experience:\n' +
        experience
          .map(
            (ex) =>
              `- ${ex.role} at ${ex.company} (${ex.period}) — tech: ${ex.technologies?.join(', ') || ''}` +
              (ex.highlights?.length ? `; highlights: ${ex.highlights.join('; ')}` : '')
          )
          .join('\n')
    );
  }

  if (projects.length) {
    sections.push(
      'Projects:\n' +
        projects
          .map(
            (p) =>
              `- ${p.name}: ${p.description} (tech: ${p.techStack?.join(', ') || ''})` +
              (p.link ? ` — link: ${p.link}` : '') +
              (p.highlights?.length ? `; highlights: ${p.highlights.join('; ')}` : '')
          )
          .join('\n')
    );
  }

  if (achievements.length) {
    sections.push('Achievements:\n' + achievements.map((a) => `- ${a}`).join('\n'));
  }

  if (skills.length) {
    sections.push('Key skills:\n' + skills.map((s) => `- ${s}`).join('\n'));
  }

  return sections.join('\n\n');
}

