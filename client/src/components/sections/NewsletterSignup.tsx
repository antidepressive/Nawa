import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../hooks/use-toast';

export const NewsletterSignup = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      const result = await response.json();
      
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      
      setEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-blue-600 text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-4">
            {t('newsletter.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {t('newsletter.description')}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder')}
              className="flex-1 px-4 py-3 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-blue-600"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent text-text-dark px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : t('newsletter.subscribe')}
            </button>
          </form>

          <p className="text-sm text-white/70 mt-4">
            {t('newsletter.privacy')}
          </p>
        </div>
      </div>
    </section>
  );
};
