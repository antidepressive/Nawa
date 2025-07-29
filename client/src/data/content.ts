import smaLogo from '@assets/partnerr-logos/sma.jpeg';
import edadLogo from '@assets/partnerr-logos/edad.jpeg';
import ideagenLogo from '@assets/partnerr-logos/ideagen.jpeg';
import delosLogo from '@assets/partnerr-logos/delos.jpeg';
import lmdfLogo from '@assets/partnerr-logos/lmdf.jpg';
import kpmgLogo from '@assets/CTP_Partners/KPMG.webp';
import pureLogo from '@assets/CTP_Partners/Pure.svg';
import destinationLogo from '@assets/CTP_Partners/Destination.svg';
import kafaaLogo from '@assets/CTP_Partners/Kafaa.png';
import streamsLogo from '@assets/CTP_Partners/Streams.jpg';
import boostLogo from '@assets/CTP_Partners/boost.png';

export const programsData = [
  {
    id: 'career',
    url: 'nawa-career',
    icon: 'rocket',
    gradient: 'from-blue-600 to-blue-700',
    features: [
      '1-on-1 Career Coaching',
      'Industry Mentorship Program', 
      'Job Placement Assistance',
      'Skills Development Workshops'
    ],
    featuresAr: [
      'تدريب مهني شخصي ١:١',
      'برنامج الإرشاد الصناعي',
      'مساعدة في التوظيف',
      'ورش تطوير المهارات'
    ]
  },
  {
    id: 'conferences',
    url: 'nawa-conferences',
    icon: 'users',
    gradient: 'from-yellow-500 to-yellow-600',
    features: [
      'International Speakers',
      'Networking Opportunities',
      'Workshop Sessions', 
      'Innovation Showcases'
    ],
    featuresAr: [
      'متحدثون عالميون',
      'فرص التواصل',
      'جلسات ورش العمل',
      'عروض الابتكار'
    ]
  },
  {
    id: 'mun',
    url: 'saudi-mun-association',
    icon: 'globe',
    gradient: 'from-green-500 to-emerald-600',
    features: [
      'Diplomatic Training',
      'Public Speaking Development',
      'International Conferences',
      'Cultural Exchange'
    ],
    featuresAr: [
      'التدريب الدبلوماسي',
      'تطوير الخطابة العامة',
      'المؤتمرات الدولية',
      'التبادل الثقافي'
    ]
  },
  {
    id: 'workshop',
    url: 'nawa-workshop',
    icon: 'heart',
    gradient: 'from-pink-500 to-rose-600',
    features: [
      'Building Self-Awareness',
      'Developing Empathy',
      'Emotional Leadership',
      'One-day Intensive Workshop'
    ],
    featuresAr: [
      'بناء الوعي الذاتي',
      'تطوير التعاطف',
      'القيادة العاطفية',
      'ورشة عمل مكثفة ليوم واحد'
    ]
  }
];

export const testimonialsData = [
  {
    id: 1,
    name: 'Ahmed Al-Rashid',
    position: 'Software Engineer, Saudi Aramco',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
    quote: 'NAWA Career didn\'t just help me find a job—it transformed my entire approach to professional development. The mentorship and guidance I received were invaluable.'
  },
  {
    id: 2,
    name: 'Fatima Al-Zahra',
    position: 'Founder, TechRise Saudi',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b9c4a9f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
    quote: 'Speaking at our conferences was a turning point in my entrepreneurial journey. The platform gave me confidence and connected me with investors who believed in my vision.'
  },
  {
    id: 3,
    name: 'Omar Al-Saud',
    position: 'Youth Delegate, United Nations',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
    quote: 'The Saudi MUN Association prepared me for representing my country on the global stage. The diplomatic skills I learned are now part of my daily work at the UN.'
  }
];

export const partnersData = [
  {
    name: 'SMA',
    logo: smaLogo
  },
  {
    name: 'Edad',
    logo: edadLogo
  },
  {
    name: 'Ideagen',
    logo: ideagenLogo
  },
  {
    name: 'Delos Arabia',
    logo: delosLogo
  },
  {
    name: 'LMDF',
    logo: lmdfLogo
  }
];

export const ctpPartnersData = [
  {
    name: 'KPMG',
    logo: kpmgLogo
  },
  {
    name: 'Pure Consulting',
    logo: pureLogo
  },
  {
    name: 'Destination',
    logo: destinationLogo
  },
  {
    name: 'Kafaa',
    logo: kafaaLogo
  },
  {
    name: 'Streams',
    logo: streamsLogo
  },
  {
    name: 'Boost',
    logo: boostLogo
  }
];

export const allPartnersData = [
  // Regular Partners
  ...partnersData,
  // CTP Partners
  ...ctpPartnersData
];

export const statsData = [
  { value: 15000, label: 'stats.students' },
  { value: 20, label: 'stats.conferences' },
  { value: 10, label: 'stats.partners' }
];
