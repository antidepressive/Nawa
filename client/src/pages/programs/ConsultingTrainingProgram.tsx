import { useLanguage } from '../../contexts/LanguageContext';
import { Calendar, Users, Target, TrendingUp, BookOpen, UserCheck, Presentation, Lightbulb } from 'lucide-react';
import { Button } from '../../components/ui/button';
import nawaBackground from '@assets/nawa-background.png';

export default function ConsultingTrainingProgram() {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: BookOpen,
      title: language === 'ar' ? 'دراسات حالة سعودية حقيقية' : 'Work on real Saudi case studies',
      description: language === 'ar' ? 'تطبيق عملي على مشاريع استشارية حقيقية من السوق السعودي' : 'Hands-on experience with actual consulting projects from the Saudi market'
    },
    {
      icon: UserCheck,
      title: language === 'ar' ? 'بناء السيرة الذاتية ومهارات المقابلات' : 'Build standout resumes and sharpen interview skills',
      description: language === 'ar' ? 'تطوير السيرة الذاتية وإتقان مهارات المقابلات الشخصية للحصول على الوظائف المرموقة' : 'Develop professional resumes and master interview techniques for top-tier positions'
    },
    {
      icon: Presentation,
      title: language === 'ar' ? 'مهارات التواصل والعرض والاستراتيجية' : 'Develop communication, presentation, and strategy skills',
      description: language === 'ar' ? 'إتقان مهارات العرض والتواصل الفعال وتطوير التفكير الاستراتيجي' : 'Master presentation skills, effective communication, and strategic thinking'
    },
    {
      icon: Lightbulb,
      title: language === 'ar' ? 'حل تحدي استشاري مباشر' : 'Solve a live consulting challenge and pitch your solution',
      description: language === 'ar' ? 'العمل على مشكلة استشارية حقيقية وتقديم الحلول للعملاء الفعليين' : 'Work on real consulting problems and present solutions to actual clients'
    }
  ];

  const partners = [
    'KPMG',
    'Pure Consulting', 
    'TAM',
    'والمزيد من الشركات الرائدة'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${nawaBackground})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="font-montserrat font-bold text-4xl md:text-6xl text-white mb-6">
              {language === 'ar' ? 'برنامج التدريب الاستشاري' : 'Consulting Training Program'}
            </h1>
            <p className="text-lg md:text-xl text-white max-w-4xl mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'استكشف أسرع القطاعات نمواً وأعلاها أجراً في المملكة العربية السعودية — الاستشارات'
                : 'Explore Saudi\'s Fastest-Growing, Best-Paying Sector — Consulting'
              }
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-montserrat font-bold text-3xl text-primary mb-6">
                  {language === 'ar' ? 'انضم إلى برنامج التدريب الاستشاري' : 'Join the Consultant Training Program'}
                </h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {language === 'ar' 
                    ? 'برنامج تدريبي مكثف لمدة 12 يوماً في جدة مصمم لإعدادك لمهنة استشارية حقيقية. تعلم مباشرة من خبراء في شركات KPMG، Pure Consulting، TAM، والمزيد.'
                    : 'A 12-day intensive bootcamp in Jeddah designed to prepare you for a real consulting career. Learn directly from experts at KPMG, Pure Consulting, TAM, and more.'
                  }
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">
                      {language === 'ar' ? '12 يوم مكثف' : '12 days intensive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">
                      {language === 'ar' ? 'خبراء من الشركات الرائدة' : 'Industry experts'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Target className="w-5 h-5" />
                    <span className="font-semibold">
                      {language === 'ar' ? 'جدة' : 'Jeddah'}
                    </span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                >
                  {language === 'ar' ? 'سجل الآن' : 'Register Now'}
                </Button>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-8 text-white">
                  <TrendingUp className="w-16 h-16 mb-6 text-blue-200" />
                  <h3 className="font-bold text-2xl mb-4">
                    {language === 'ar' ? 'لماذا الاستشارات؟' : 'Why Consulting?'}
                  </h3>
                  <ul className="space-y-3 text-blue-100">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      {language === 'ar' ? 'أسرع القطاعات نمواً' : 'Fastest-growing sector'}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      {language === 'ar' ? 'أعلى الرواتب' : 'Highest paying careers'}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      {language === 'ar' ? 'فرص وظيفية متنوعة' : 'Diverse career opportunities'}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      {language === 'ar' ? 'تأثير مباشر على الأعمال' : 'Direct business impact'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Gain Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-6">
              {language === 'ar' ? 'ما ستحصل عليه' : 'What You\'ll Gain'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'برنامج شامل مصمم لتزويدك بالمهارات والخبرات اللازمة للنجاح في مجال الاستشارات'
                : 'A comprehensive program designed to equip you with the skills and experience needed to succeed in consulting'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-montserrat font-bold text-3xl text-primary mb-8">
            {language === 'ar' ? 'تعلم من خبراء الشركات الرائدة' : 'Learn from Industry Leaders'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <p className="font-semibold text-gray-800">{partner}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-16 px-4 sm:px-6 lg:px-8 bg-primary bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${nawaBackground})` }}
      >
        <div className="absolute inset-0 bg-primary/80"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-6">
            {language === 'ar' ? 'هل أنت مستعد لبدء رحلتك الاستشارية؟' : 'Ready to Start Your Consulting Journey?'}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'انضم إلى برنامج التدريب الاستشاري واكتسب المهارات التي تحتاجها للنجاح في هذا المجال المتنامي'
              : 'Join the Consulting Training Program and gain the skills you need to succeed in this growing field'
            }
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              {language === 'ar' ? 'سجل الآن' : 'Register Now'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}