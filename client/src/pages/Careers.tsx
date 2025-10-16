import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navigation } from '../components/sections/Navigation';
import { Footer } from '../components/sections/Footer';
import { ScrollToTop } from '../components/ui/ScrollToTop';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle, Briefcase, Clock } from 'lucide-react';
import nawaBackground from '@assets/nawa-background.webp';
import { jobs } from '../data/jobs';
import { Link } from 'wouter';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  workExperience: string;
  education: string;
  skills: string;
  resumePath: string;
}

export default function Careers() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '966',
    position: '',
    workExperience: '',
    education: '',
    skills: '',
    resumePath: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');

  useEffect(() => {
    document.title = language === 'ar' ? 'انضم إلى فريقنا - نواة' : 'Join Our Team - NAWA';
    
    // Check for preselected position from job detail page
    const preselectedPosition = localStorage.getItem('selectedPosition');
    if (preselectedPosition) {
      setFormData(prev => ({ ...prev, position: preselectedPosition }));
      localStorage.removeItem('selectedPosition');
    }
  }, [language]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^966[5-9]\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'phone') {
      // Ensure phone always starts with 966 and only accept digits after
      let phoneValue = value;
      phoneValue = phoneValue.replace(/[^\d]/g, '');
      
      if (!phoneValue.startsWith('966')) {
        phoneValue = '966' + phoneValue.replace(/^966/, '');
      } else {
        phoneValue = '966' + phoneValue.substring(3);
      }
      setFormData((prev) => ({ ...prev, [field]: phoneValue }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError('');
    
    if (!file) {
      setSelectedFile(null);
      setFormData(prev => ({ ...prev, resumePath: '' }));
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      setFileError(t('careers.fileValidation.pdfOnly'));
      setSelectedFile(null);
      setFormData(prev => ({ ...prev, resumePath: '' }));
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFileError(t('careers.fileValidation.fileTooLarge'));
      setSelectedFile(null);
      setFormData(prev => ({ ...prev, resumePath: '' }));
      return;
    }

    setSelectedFile(file);
  };

  const uploadResume = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch('/api/upload-resume', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload resume');
    }

    const result = await response.json();
    return result.filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Partial<FormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('careers.validation.firstName');
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('careers.validation.lastName');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('careers.validation.email');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('careers.validation.email');
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = t('careers.validation.phone');
    }
    
    if (!formData.workExperience.trim()) {
      newErrors.workExperience = t('careers.validation.workExperience');
    }
    
    if (!formData.education.trim()) {
      newErrors.education = t('careers.validation.education');
    }
    
    if (!formData.skills.trim()) {
      newErrors.skills = t('careers.validation.skills');
    }

    if (!formData.position.trim()) {
      newErrors.position = t('careers.validation.position');
    }

    if (!selectedFile) {
      setFileError(t('careers.fileValidation.fileRequired'));
    }
    
    if (Object.keys(newErrors).length > 0 || !selectedFile) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload resume first
      const resumePath = await uploadResume(selectedFile);
      
      // Submit application
      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          resumePath,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      // Success
      toast({
        title: t('careers.success'),
        description: t('careers.successMessage'),
        action: <CheckCircle className="h-4 w-4 text-green-600" />,
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '966',
        position: '',
        workExperience: '',
        education: '',
        skills: '',
        resumePath: '',
      });
      setSelectedFile(null);
      setErrors({});
      setFileError('');

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: t('careers.error'),
        description: t('careers.errorMessage'),
        action: <AlertCircle className="h-4 w-4 text-red-600" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
        backgroundImage: `url(${nawaBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-montserrat">
              {t('careers.title')}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              {t('careers.subtitle')}
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {t('careers.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              title={t('careers.openPositions')}
              subtitle={t('careers.openPositionsSubtitle')}
              className="text-center mb-12"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job.slug} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-accent">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {job.department}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {job.employmentType}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {job.summary}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <Link href={`/careers/${job.slug}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-accent border-accent hover:bg-accent hover:text-text-dark"
                      >
                        {t('careers.viewDetails')}
                      </Button>
                    </Link>
                    <Button 
                      size="sm"
                      className="bg-accent text-text-dark hover:bg-yellow-400"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, position: job.title }));
                        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {t('careers.applyNow')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              title={t('careers.formTitle')}
              subtitle=""
              className="text-center mb-12"
            />
            
            <div id="application-form" className="bg-white rounded-2xl shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 font-montserrat">
                    {t('careers.personalInfo')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        {t('careers.firstName')} *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        {t('careers.lastName')} *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        {t('careers.email')} *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        {t('careers.phone')} *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                        placeholder="966xxxxxxxxx"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Position Selection */}
                <div>
                  <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                    {t('careers.position')} *
                  </Label>
                  <select
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent ${errors.position ? 'border-red-500' : ''}`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <option value="">{t('careers.selectPosition')}</option>
                    {jobs.map((job) => (
                      <option key={job.slug} value={job.title}>
                        {job.title} - {job.department}
                      </option>
                    ))}
                  </select>
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                  )}
                </div>

                {/* Work Experience */}
                <div>
                  <Label htmlFor="workExperience" className="text-sm font-medium text-gray-700">
                    {t('careers.workExperience')} *
                  </Label>
                  <Textarea
                    id="workExperience"
                    value={formData.workExperience}
                    onChange={(e) => handleInputChange('workExperience', e.target.value)}
                    placeholder={t('careers.workExperiencePlaceholder')}
                    className={`mt-1 min-h-[120px] ${errors.workExperience ? 'border-red-500' : ''}`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {errors.workExperience && (
                    <p className="mt-1 text-sm text-red-600">{errors.workExperience}</p>
                  )}
                </div>

                {/* Education */}
                <div>
                  <Label htmlFor="education" className="text-sm font-medium text-gray-700">
                    {t('careers.education')} *
                  </Label>
                  <Textarea
                    id="education"
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    placeholder={t('careers.educationPlaceholder')}
                    className={`mt-1 min-h-[120px] ${errors.education ? 'border-red-500' : ''}`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {errors.education && (
                    <p className="mt-1 text-sm text-red-600">{errors.education}</p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <Label htmlFor="skills" className="text-sm font-medium text-gray-700">
                    {t('careers.skills')} *
                  </Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder={t('careers.skillsPlaceholder')}
                    className={`mt-1 min-h-[120px] ${errors.skills ? 'border-red-500' : ''}`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {errors.skills && (
                    <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
                  )}
                </div>

                {/* Resume Upload */}
                <div>
                  <Label htmlFor="resume" className="text-sm font-medium text-gray-700">
                    {t('careers.resume')} *
                  </Label>
                  <div className="mt-1">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="resume"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">{t('careers.uploadResume')}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {t('careers.resumePlaceholder')}
                          </p>
                        </div>
                        <input
                          id="resume"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {selectedFile && (
                      <div className="mt-3 flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <FileText className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm text-green-800">
                          {t('careers.fileSelected')}: {selectedFile.name}
                        </span>
                      </div>
                    )}
                    
                    {fileError && (
                      <p className="mt-1 text-sm text-red-600">{fileError}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent text-text-dark px-8 py-3 text-lg font-semibold hover:bg-yellow-400 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? t('careers.submitting') : t('careers.submit')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </>
  );
}
