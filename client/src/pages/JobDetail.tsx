import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { useLanguage } from '../contexts/LanguageContext';
import { Navigation } from '../components/sections/Navigation';
import { Footer } from '../components/sections/Footer';
import { ScrollToTop } from '../components/ui/ScrollToTop';
import { Button } from '../components/ui/button';
import { Briefcase, Clock, ArrowLeft, CheckCircle, Users } from 'lucide-react';
import nawaBackground from '@assets/nawa-background.webp';
import { getJobBySlug, jobs } from '../data/jobs';
import { Link } from 'wouter';

export default function JobDetail() {
  const { t, language } = useLanguage();
  const [, params] = useRoute('/careers/:slug');
  const [job, setJob] = useState(getJobBySlug(params?.slug || ''));

  useEffect(() => {
    if (params?.slug) {
      const foundJob = getJobBySlug(params.slug);
      setJob(foundJob);
      
      if (foundJob) {
        document.title = language === 'ar' 
          ? `${foundJob.title} - الوظائف - نواة` 
          : `${foundJob.title} - Careers - NAWA`;
        
        // Add meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', foundJob.summary);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = foundJob.summary;
          document.head.appendChild(meta);
        }
        
        // Add JSON-LD structured data
        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": foundJob.title,
          "description": foundJob.summary,
          "hiringOrganization": {
            "@type": "Organization",
            "name": "NAWA",
            "url": "https://nawa.sa"
          },
          "employmentType": foundJob.employmentType,
          "jobLocationType": "TELECOMMUTE",
          "datePosted": new Date().toISOString(),
          "responsibilities": foundJob.responsibilities,
          "qualifications": foundJob.qualifications || foundJob.requirements
        };
        
        // Remove existing JSON-LD if any
        const existingJsonLd = document.querySelector('script[type="application/ld+json"]');
        if (existingJsonLd) {
          existingJsonLd.remove();
        }
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(jsonLd);
        document.head.appendChild(script);
        
      } else {
        document.title = language === 'ar' ? 'الوظيفة غير موجودة - نواة' : 'Job Not Found - NAWA';
      }
    }
  }, [params?.slug, language]);

  if (!job) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'الوظيفة غير موجودة' : 'Job Not Found'}
            </h1>
            <p className="text-gray-600 mb-8">
              {language === 'ar' 
                ? 'عذراً، الوظيفة التي تبحث عنها غير موجودة.' 
                : 'Sorry, the job you are looking for does not exist.'}
            </p>
            <Link href="/careers">
              <Button className="bg-accent text-text-dark hover:bg-yellow-400">
                {t('careers.backToCareers')}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
        <ScrollToTop />
      </>
    );
  }

  const handleApplyClick = () => {
    // Store the selected position in localStorage for the form
    localStorage.setItem('selectedPosition', job.title);
    // Navigate to careers page and scroll to form
    window.location.href = '/careers#application-form';
  };

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{
        backgroundImage: `url(${nawaBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link href="/careers">
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('careers.backToCareers')}
                </Button>
              </Link>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-montserrat">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90 mb-8">
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                <span className="text-lg">{job.department}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-lg">{job.employmentType}</span>
              </div>
            </div>
            
            <p className="text-xl text-white/90 max-w-3xl">
              {job.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Job Details Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Responsibilities */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 font-montserrat flex items-center">
                    <CheckCircle className="w-6 h-6 mr-3 text-accent" />
                    {t('careers.responsibilities')}
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements / Qualifications */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 font-montserrat flex items-center">
                    <Users className="w-6 h-6 mr-3 text-accent" />
                    {job.qualifications ? t('careers.qualifications') : t('careers.requirements')}
                  </h2>
                  <ul className="space-y-3">
                    {(job.qualifications || job.requirements)?.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-2xl p-8 sticky top-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 font-montserrat">
                    {t('careers.applyForPosition')}
                  </h3>
                  
                  <div className="space-y-4 mb-8">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Department</span>
                      <p className="text-gray-900">{job.department}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Employment Type</span>
                      <p className="text-gray-900">{job.employmentType}</p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleApplyClick}
                    className="w-full bg-accent text-text-dark hover:bg-yellow-400 text-lg py-3"
                  >
                    {t('careers.applyNow')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </>
  );
}
