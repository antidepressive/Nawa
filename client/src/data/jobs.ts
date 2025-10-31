export interface Job {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  summary: string;
  responsibilities: string[];
  requirements?: string[];
  qualifications?: string[];
  lang?: 'en' | 'ar';
  documentUrl?: string;
}

export const jobs: Job[] = [
  {
    slug: 'copywriter',
    title: 'Copywriter',
    department: 'Marketing',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'As a Copywriter at NAWA, you will be responsible for shaping the voice and message of our organization. You will create compelling written content for presentations, reports, websites, and marketing materials that represent NAWA\'s values of leadership, community, and career empowerment. This role requires creativity, precision, and the ability to translate ideas into clear, professional, and inspiring language.',
    responsibilities: [
      'Develop high-quality written content for NAWA\'s reports, proposals, and official documents.',
      'Create professional slide decks for programs, conferences, and sponsorship pitches.',
      'Collaborate with designers and the media team to ensure content matches NAWA\'s brand identity.',
      'Draft speeches, social media captions, and thought-leadership articles aligned with NAWA\'s vision.',
      'Edit and proofread all content to ensure clarity, accuracy, and consistency.'
    ],
    qualifications: [
      'Excellent writing skills in both English and Arabic.',
      'Strong storytelling and presentation building ability.',
      'Experience with content creation for professional organizations, NGOs, or startups is a plus.',
      'Familiarity with PowerPoint/Google Slides, Canva, or similar tools.',
      'Ability to work under tight deadlines with attention to detail.'
    ],
    lang: 'en',
    documentUrl: '/job-descriptions/copywriter.pdf'
  },
  {
    slug: 'designer',
    title: 'Graphic Designer',
    department: 'Creative',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'As a Designer at NAWA, you will play a vital role in shaping our visual identity and ensuring that all communications, programs, and events reflect a world-class standard. You will collaborate with the PR and Copywriting teams to produce designs that inspire, engage, and embody NAWA\'s mission of empowering youth and building community.',
    responsibilities: [
      'Develop visual designs for reports, presentations, and sponsorship decks.',
      'Create graphics for NAWA programs, conferences, workshops, and social media.',
      'Ensure consistent branding across all NAWA materials (logos, templates, certificates, merchandise).',
      'Collaborate with the media team to design event visuals (posters, banners, slides).',
      'Support creative projects with fresh design concepts aligned with NAWA\'s style guide.'
    ],
    qualifications: [
      'Strong proficiency in design tools (Adobe Creative Suite, Canva, or equivalent).',
      'Portfolio of past design work (academic, freelance, or organizational).',
      'Ability to deliver creative work under tight deadlines.',
      'Knowledge of branding and visual storytelling.',
      'Attention to detail and a passion for design in youth and community projects.'
    ],
    lang: 'en',
    documentUrl: '/job-descriptions/designer.pdf'
  },
  {
    slug: 'financial-officer',
    title: 'Financial Officer',
    department: 'Finance',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'The Financial Officer at NAWA is responsible for overseeing the financial health of the organization. This includes managing budgets, tracking program profitability, ensuring compliance with Saudi regulations, and producing reports that guide the leadership team in decision-making. This role is critical to building NAWA\'s sustainability as it grows into one of the Kingdom\'s leading youth empowerment platforms.',
    responsibilities: [
      'Prepare and monitor budgets for all NAWA programs, conferences, and academies.',
      'Produce monthly and quarterly financial reports for the Board.',
      'Track revenue streams, expenses, and program profitability.',
      'Ensure compliance with Saudi financial regulations, Zakat & VAT requirements.',
      'Maintain relationships with auditors, accountants, and banks.',
      'Develop financial forecasts and sustainability models for long-term growth.',
      'Support sponsorship and partnership negotiations with financial planning.'
    ],
    qualifications: [
      'Experience in Accounting, Finance, Economics, or related field.',
      'Strong knowledge of financial management, budgeting, and reporting.',
      'Familiarity with Saudi corporate financial regulations (VAT, Zakat, compliance).',
      'Proficiency in Excel, financial modeling, and reporting tools.',
      'Prior experience in NGOs, startups, or youth organizations is a plus.',
      'High integrity, attention to detail, and confidentiality.'
    ],
    lang: 'en',
    documentUrl: '/job-descriptions/financial-officer.pdf'
  },
  {
    slug: 'head-of-media',
    title: 'Head of Media',
    department: 'Media & Communications',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'The Head of Media at NAWA is responsible for leading all media production and creative storytelling. This role oversees designers, video editors, photographers, and social media producers to ensure NAWA\'s brand is consistently presented at the highest level. The Head of Media plays a strategic role in amplifying NAWA\'s message, capturing its programs, and showcasing its impact to the community, sponsors, and partners. This is both a creative leadership role and a strategic growth role within NAWA, with clear opportunities for advancement into executive leadership.',
    responsibilities: [
      'Lead and manage the entire Media Department (design, video, photography, social media).',
      'Set creative direction for NAWA\'s programs, conferences, academies, and campaigns.',
      'Ensure professional coverage of all NAWA events, creating highlight reels, recaps, and sponsorship deliverables.',
      'Collaborate with PR and Communications teams to maximize sponsor visibility and NAWA brand presence.',
      'Maintain a consistent visual identity across all platforms and outputs.',
      'Mentor junior creatives, interns, and volunteers within the media unit.'
    ],
    qualifications: [
      'Proven leadership experience in media, communications, or creative direction.',
      'Strong portfolio of work (video production, design, campaigns).',
      'Proficiency in creative software (Adobe Creative Suite, Premiere Pro, Final Cut, DaVinci Resolve, Canva).',
      'Ability to manage a team and deliver high-quality outputs under deadlines.',
      'Strong understanding of branding, storytelling, and audience engagement.'
    ],
    lang: 'en',
    documentUrl: '/job-descriptions/head-of-media.pdf'
  },
  {
    slug: 'project-manager',
    title: 'Project Manager',
    department: 'Operations',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'At NAWA, Project Managers are mini-consultants: they are entrusted with leading entire projects and programs from concept to execution. Each Project Manager is assigned their own portfolio project (conference, academy, training, or special initiative), and is responsible for managing its strategy, operations, partners, and delivery. They are the face of NAWA for their project, building credibility for themselves and the organization while ensuring high-quality outcomes that align with NAWA\'s vision.',
    responsibilities: [
      'Program Ownership: Lead a full NAWA program (or major project) independently.',
      'Strategic Planning: Develop project scope, objectives, timelines, and KPIs.',
      'Team Leadership: Coordinate with NAWA\'s functional units (Media, PR, Finance, QA, Career, Conferences, SMA) to deliver tasks on schedule.',
      'Partner & Sponsor Management: Manage relationships with universities, ministries, corporates, and NGOs as the official NAWA representative.',
      'Operations: Handle budgeting, logistics, documentation, and on the ground execution.',
      'Impact Reporting: Collect data, measure outcomes, and prepare final project reports with insights for improvement.',
      'Profile Development: Build their own professional portfolio under NAWA, including certificates, project reports, and leadership recognition.'
    ],
    lang: 'en',
    documentUrl: '/job-descriptions/project-manager.pdf'
  },
  {
    slug: 'quality-assurance-officer',
    title: 'Quality Assurance Officer',
    department: 'Operations',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'The Quality Assurance Officer (QA Officer) at NAWA ensures that all departments and team members deliver their responsibilities on time, to standard, and in alignment with NAWA\'s mission. This role tracks team accountability, organizes structured feedback after events, and generates data-driven reports that help leadership assess performance and improve overall quality.',
    responsibilities: [
      'Track assignments, deadlines, and deliverables across all NAWA branches (Career, Conferences, SMA, Operations, Media).',
      'Follow up with team members to ensure accountability for tasks.',
      'Report non-compliance or missed deadlines to leadership with recommendations.',
      'Design and distribute post-event surveys to participants, sponsors, and staff.',
      'Collect and analyze feedback data to assess program effectiveness.',
      'Provide written quality reports with actionable recommendations for improvement.',
      'Maintain a dashboard of key quality indicators (engagement, satisfaction, delivery).',
      'Identify systemic issues and propose solutions to improve NAWA workflows.',
      'Facilitate internal review meetings to discuss strengths and areas for improvement.'
    ],
    lang: 'en',
    documentUrl: '/job-descriptions/quality-assurance-officer.pdf'
  },
  {
    slug: 'video-editor',
    title: 'Video Editor',
    department: 'Creative',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Remote',
    summary: 'As a Video Editor at NAWA, you will be responsible for transforming raw footage into compelling, professional, and impactful videos that showcase NAWA\'s programs, conferences, and community initiatives. You will bring NAWA\'s story to life, ensuring every video reflects our values of leadership, belonging, and youth empowerment.',
    responsibilities: [
      'Edit event coverage, highlight reels, and program recaps for NAWA activities.',
      'Create promotional videos for upcoming workshops, academies, and conferences.',
      'Ensure brand consistency across all media outputs (intro/outro templates, colors, fonts, logos).',
      'Collaborate with designers, copywriters, and the media team to deliver integrated campaigns.',
      'Maintain organized archives of video projects and footage for future use.',
      'Stay updated on editing trends to keep NAWA content modern and engaging.'
    ],
    qualifications: [
      'Proficiency in video editing software (Adobe Premiere Pro, Final Cut, DaVinci Resolve, or equivalent).',
      'Strong portfolio of video editing work (academic, freelance, or professional).',
      'Knowledge of color grading, sound editing, and motion graphics is a plus.',
      'Ability to meet deadlines and work efficiently under time pressure.',
      'Passion for storytelling and creating content that inspires youth.'
    ],
    lang: 'en',
    documentUrl: '/job-descriptions/video-editor.pdf'
  }
];

export const getJobBySlug = (slug: string): Job | undefined => {
  return jobs.find(job => job.slug === slug);
};

export const getJobsByDepartment = (department: string): Job[] => {
  return jobs.filter(job => job.department === department);
};
