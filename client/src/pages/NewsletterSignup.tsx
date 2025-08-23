import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../hooks/use-toast';
import backgroundImage from '@assets/nawa-background.webp';
import qrCodeImage from '@assets/frame.png';

export default function NewsletterSignup() {
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
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-600">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="font-montserrat font-bold text-4xl md:text-6xl text-white mb-6">
              {t('newsletter.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t('newsletter.description')}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Newsletter Form Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
                             <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                 {t('newsletter.pageTitle')}
               </h2>
               <p className="text-white/80 mb-8 text-lg">
                 {t('newsletter.pageDescription')}
               </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                                   <label htmlFor="email" className="block text-white font-medium mb-2">
                   {t('newsletter.emailLabel')}
                 </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    className="w-full px-6 py-4 rounded-xl text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-200"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-text-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-2 focus:ring-offset-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isSubmitting ? 'Subscribing...' : t('newsletter.subscribe')}
                </button>
              </form>

              <p className="text-sm text-white/70 mt-6 text-center">
                {t('newsletter.privacy')}
              </p>
            </div>

            {/* QR Code Section */}
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
                                 <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                   Visit Our Website
                 </h3>
                 <p className="text-white/80 mb-8 text-lg">
                   Scan this QR code with your phone's camera to quickly visit our website
                 </p>
                
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-xl shadow-2xl">
                    <img 
                      src={qrCodeImage} 
                      alt="Newsletter QR Code" 
                      className="w-48 h-48 md:w-64 md:h-64 object-contain"
                    />
                  </div>
                </div>
                
                                 <p className="text-white/60 text-sm">
                   Point your camera at the QR code above to visit our website instantly
                 </p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}
