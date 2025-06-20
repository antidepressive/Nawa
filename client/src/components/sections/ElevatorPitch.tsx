import { useLanguage } from '../../contexts/LanguageContext';

export const ElevatorPitch = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-br from-bg-light to-white section-extended">
      <div className="content-wrapper">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-8">
            {t('pitch.title')}
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>{t('pitch.paragraph1')}</p>
            <p>{t('pitch.paragraph2')}</p>
            <p>{t('pitch.paragraph3')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
