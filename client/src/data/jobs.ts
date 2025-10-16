export interface Job {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  benefits?: string[];
  pdf?: string;
  lang?: 'en' | 'ar';
}

export const jobs: Job[] = [
  {
    slug: 'copywriter',
    title: 'Copywriter',
    department: 'Marketing',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'We are seeking a creative and strategic Copywriter to join our marketing team. The ideal candidate will craft compelling content that resonates with our target audience and drives engagement across various platforms.',
    responsibilities: [
      'Develop compelling copy for marketing campaigns, social media, and website content',
      'Create engaging content for email marketing campaigns and newsletters',
      'Write persuasive copy for advertisements, brochures, and promotional materials',
      'Collaborate with design teams to ensure copy complements visual elements',
      'Maintain brand voice and tone consistency across all communications',
      'Conduct research on target audience preferences and industry trends',
      'Edit and proofread content for accuracy, clarity, and brand alignment',
      'Work with cross-functional teams to develop content strategies'
    ],
    requirements: [
      'Bachelor\'s degree in Marketing, Communications, Journalism, or related field',
      'Minimum 2-3 years of copywriting experience',
      'Excellent written and verbal communication skills in Arabic and English',
      'Strong understanding of marketing principles and consumer psychology',
      'Experience with content management systems and digital marketing tools',
      'Ability to work under tight deadlines and manage multiple projects',
      'Creative thinking and problem-solving abilities',
      'Portfolio demonstrating diverse writing styles and successful campaigns'
    ],
    niceToHave: [
      'Experience in the nonprofit or education sector',
      'Knowledge of SEO best practices',
      'Social media management experience',
      'Graphic design or video scripting experience',
      'Certification in digital marketing or content strategy'
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance coverage',
      'Professional development opportunities',
      'Flexible working arrangements',
      'Collaborative and innovative work environment',
      'Opportunity to make a meaningful impact on Saudi youth'
    ],
    pdf: 'attached_assets/jobDescriptions/Job Description- Copywriter.pdf',
    lang: 'en'
  },
  {
    slug: 'designer',
    title: 'Graphic Designer',
    department: 'Creative',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'We are looking for a talented Graphic Designer to create visually stunning designs that communicate our mission and engage our audience. The role involves working on diverse projects from digital campaigns to print materials.',
    responsibilities: [
      'Create visually appealing designs for digital and print materials',
      'Develop brand-consistent visual identities and style guides',
      'Design marketing collateral including brochures, flyers, and banners',
      'Create engaging social media graphics and digital advertisements',
      'Collaborate with copywriters and marketing teams on campaign concepts',
      'Prepare final artwork for production and digital publishing',
      'Maintain organized design files and asset libraries',
      'Present design concepts and incorporate feedback from stakeholders'
    ],
    requirements: [
      'Bachelor\'s degree in Graphic Design, Visual Arts, or related field',
      'Minimum 2-3 years of professional design experience',
      'Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
      'Strong portfolio demonstrating creative and technical skills',
      'Understanding of design principles, typography, and color theory',
      'Experience with both print and digital design workflows',
      'Excellent communication and collaboration skills',
      'Ability to work under pressure and meet tight deadlines'
    ],
    niceToHave: [
      'Experience with motion graphics or video editing',
      'Web design and UI/UX knowledge',
      'Photography skills',
      'Experience in nonprofit or education sector',
      'Knowledge of Arabic typography and RTL design principles'
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance coverage',
      'Professional development opportunities',
      'Flexible working arrangements',
      'Access to latest design tools and software',
      'Creative freedom and collaborative environment'
    ],
    pdf: 'attached_assets/jobDescriptions/Job Description- Designer.pdf',
    lang: 'en'
  },
  {
    slug: 'financial-officer',
    title: 'Financial Officer',
    department: 'Finance',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'We are seeking a detail-oriented Financial Officer to manage our financial operations, ensure compliance, and support strategic financial planning. The role involves overseeing accounting processes, budgeting, and financial reporting.',
    responsibilities: [
      'Manage day-to-day financial operations and accounting processes',
      'Prepare and analyze financial statements and reports',
      'Develop and monitor annual budgets and financial forecasts',
      'Ensure compliance with local financial regulations and standards',
      'Process invoices, payments, and expense reimbursements',
      'Maintain accurate financial records and documentation',
      'Coordinate with external auditors and tax consultants',
      'Provide financial analysis and recommendations to management'
    ],
    requirements: [
      'Bachelor\'s degree in Accounting, Finance, or related field',
      'Minimum 3-4 years of financial management experience',
      'Professional accounting certification (CPA, CMA, or equivalent)',
      'Proficiency in accounting software and financial systems',
      'Strong analytical and problem-solving skills',
      'Excellent attention to detail and organizational abilities',
      'Knowledge of Saudi financial regulations and tax laws',
      'Advanced Excel skills and financial modeling experience'
    ],
    niceToHave: [
      'Experience in nonprofit or education sector',
      'Experience with grant management and reporting',
      'Knowledge of international accounting standards',
      'Arabic language proficiency',
      'Experience with ERP systems'
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance coverage',
      'Professional development opportunities',
      'Flexible working arrangements',
      'Opportunity to contribute to meaningful social impact',
      'Collaborative work environment'
    ],
    pdf: 'attached_assets/jobDescriptions/Job Description- Financial Officer.pdf',
    lang: 'en'
  },
  {
    slug: 'head-of-media',
    title: 'Head of Media',
    department: 'Media & Communications',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'We are looking for a strategic Head of Media to lead our media operations, develop content strategies, and manage our public relations efforts. This role requires strong leadership skills and media expertise.',
    responsibilities: [
      'Develop and implement comprehensive media and communications strategies',
      'Lead media relations and public relations activities',
      'Manage content creation across multiple platforms and channels',
      'Oversee social media strategy and community management',
      'Coordinate press releases, media interviews, and public appearances',
      'Monitor media coverage and manage crisis communications',
      'Collaborate with internal teams on integrated marketing campaigns',
      'Manage media partnerships and stakeholder relationships'
    ],
    requirements: [
      'Bachelor\'s degree in Media, Communications, Journalism, or related field',
      'Minimum 5-6 years of media and communications experience',
      'Proven track record in media relations and public relations',
      'Strong leadership and team management skills',
      'Excellent written and verbal communication skills in Arabic and English',
      'Experience with digital media platforms and social media management',
      'Knowledge of media monitoring and analytics tools',
      'Ability to work under pressure and manage multiple priorities'
    ],
    niceToHave: [
      'Master\'s degree in Communications or related field',
      'Experience in nonprofit or education sector',
      'Video production or broadcast media experience',
      'Crisis communications certification',
      'International media relations experience'
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance coverage',
      'Professional development opportunities',
      'Flexible working arrangements',
      'Leadership role with significant impact',
      'Opportunity to shape organizational communications'
    ],
    pdf: 'attached_assets/jobDescriptions/Job Description- Head of Media.pdf',
    lang: 'en'
  },
  {
    slug: 'project-manager',
    title: 'Project Manager',
    department: 'Operations',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'We are seeking an experienced Project Manager to oversee our various programs and initiatives. The role involves planning, executing, and monitoring projects to ensure successful delivery and impact.',
    responsibilities: [
      'Plan, execute, and monitor multiple projects simultaneously',
      'Develop project timelines, budgets, and resource allocation plans',
      'Coordinate with cross-functional teams and external stakeholders',
      'Monitor project progress and identify potential risks or issues',
      'Prepare regular project status reports and presentations',
      'Ensure projects meet quality standards and deliver expected outcomes',
      'Manage project documentation and maintain organized records',
      'Facilitate team meetings and stakeholder communications'
    ],
    requirements: [
      'Bachelor\'s degree in Business Administration, Project Management, or related field',
      'Minimum 4-5 years of project management experience',
      'Project Management Professional (PMP) certification preferred',
      'Proficiency in project management software and tools',
      'Strong organizational and time management skills',
      'Excellent communication and interpersonal abilities',
      'Experience with budget management and resource allocation',
      'Ability to work with diverse teams and stakeholders'
    ],
    niceToHave: [
      'Experience in nonprofit or education sector',
      'Agile or Scrum methodology experience',
      'International project management experience',
      'Arabic language proficiency',
      'Experience with grant-funded projects'
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance coverage',
      'Professional development opportunities',
      'Flexible working arrangements',
      'Opportunity to lead impactful projects',
      'Collaborative and dynamic work environment'
    ],
    pdf: 'attached_assets/jobDescriptions/Job Description- Project Mangment.pdf',
    lang: 'en'
  },
  {
    slug: 'quality-assurance-officer',
    title: 'Quality Assurance Officer',
    department: 'Operations',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'We are looking for a detail-oriented Quality Assurance Officer to ensure our programs and services meet the highest standards. The role involves developing quality frameworks, conducting audits, and implementing improvement processes.',
    responsibilities: [
      'Develop and implement quality assurance frameworks and standards',
      'Conduct regular audits and assessments of programs and processes',
      'Monitor compliance with organizational policies and procedures',
      'Identify areas for improvement and recommend corrective actions',
      'Prepare quality reports and documentation for stakeholders',
      'Train staff on quality standards and best practices',
      'Coordinate with external auditors and certification bodies',
      'Maintain quality management systems and documentation'
    ],
    requirements: [
      'Bachelor\'s degree in Quality Management, Business Administration, or related field',
      'Minimum 3-4 years of quality assurance experience',
      'Quality management certification (ISO 9001, Six Sigma, or equivalent)',
      'Strong analytical and problem-solving skills',
      'Excellent attention to detail and organizational abilities',
      'Experience with quality management systems and tools',
      'Good communication and training skills',
      'Knowledge of auditing principles and practices'
    ],
    niceToHave: [
      'Experience in nonprofit or education sector',
      'Experience with program evaluation methodologies',
      'Arabic language proficiency',
      'Experience with international quality standards',
      'Data analysis and reporting skills'
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance coverage',
      'Professional development opportunities',
      'Flexible working arrangements',
      'Opportunity to ensure program excellence',
      'Collaborative work environment'
    ],
    pdf: 'attached_assets/jobDescriptions/Job Description- Quality Assurance Officer.pdf',
    lang: 'en'
  },
  {
    slug: 'video-editor',
    title: 'Video Editor',
    department: 'Creative',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'We are seeking a creative Video Editor to produce engaging video content that tells our story and connects with our audience. The role involves editing, post-production, and creating compelling visual narratives.',
    responsibilities: [
      'Edit and produce high-quality video content for various platforms',
      'Create engaging video content for social media, website, and presentations',
      'Collaborate with content creators and marketing teams on video concepts',
      'Manage video production workflows from raw footage to final delivery',
      'Ensure video content aligns with brand guidelines and messaging',
      'Optimize videos for different platforms and viewing contexts',
      'Maintain organized video libraries and asset management systems',
      'Stay updated with video editing trends and technologies'
    ],
    requirements: [
      'Bachelor\'s degree in Film, Media Production, or related field',
      'Minimum 2-3 years of professional video editing experience',
      'Proficiency in video editing software (Adobe Premiere Pro, Final Cut Pro, etc.)',
      'Strong portfolio demonstrating creative and technical video editing skills',
      'Experience with motion graphics and visual effects',
      'Knowledge of video formats, codecs, and compression techniques',
      'Excellent attention to detail and creative vision',
      'Ability to work under tight deadlines and manage multiple projects'
    ],
    niceToHave: [
      'Experience with After Effects and motion graphics',
      'Color grading and audio editing skills',
      'Experience with live streaming and broadcast production',
      'Knowledge of Arabic typography and RTL video editing',
      'Experience in nonprofit or education sector'
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance coverage',
      'Professional development opportunities',
      'Flexible working arrangements',
      'Access to professional video equipment and software',
      'Creative freedom and collaborative environment'
    ],
    pdf: 'attached_assets/jobDescriptions/Job Description- Video Editor.pdf',
    lang: 'en'
  }
];

export const getJobBySlug = (slug: string): Job | undefined => {
  return jobs.find(job => job.slug === slug);
};

export const getJobsByDepartment = (department: string): Job[] => {
  return jobs.filter(job => job.department === department);
};
