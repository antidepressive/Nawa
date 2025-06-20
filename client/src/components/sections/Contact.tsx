import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SectionHeading } from '../ui/SectionHeading';
import { useToast } from '../../hooks/use-toast';
import { MapPin, Phone, Mail, MessageSquare, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

interface FormData {
  name: string;
  organization: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

export const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    organization: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      
      toast({
        title: "Message Sent!",
        description: "Thank you for your interest. We'll get back to you soon and send you our sponsorship deck.",
      });
      
      // Reset form
      setFormData({
        name: '',
        organization: '',
        email: '',
        phone: '',
        interest: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t('contact.title')}
          subtitle={t('contact.subtitle')}
        />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="font-montserrat font-bold text-2xl text-primary mb-6">
                {t('contact.letsConnect')}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {t('contact.description')}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark mb-1">{t('contact.address')}</h4>
                  <p className="text-gray-600">King Fahd Road, Riyadh 12345<br />Kingdom of Saudi Arabia</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark mb-1">{t('contact.phone')}</h4>
                  <p className="text-gray-600">+966 11 234 5678</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-dark mb-1">{t('contact.email')}</h4>
                  <p className="text-gray-600">partnerships@nawaalathr.org</p>
                </div>
              </div>

              <a
                href="https://wa.me/966112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                {t('contact.whatsapp')}
              </a>
            </div>

            {/* Google Maps Placeholder */}
            <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <MapPin className="w-12 h-12 mx-auto mb-4" />
                  <p className="font-semibold">Interactive Map</p>
                  <p className="text-sm">Google Maps Integration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="font-montserrat font-bold text-2xl text-primary mb-6">
              {t('contact.formTitle')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('contact.name')} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">{t('contact.organization')}</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('contact.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('contact.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest">{t('contact.interest')}</Label>
                <Select value={formData.interest} onValueChange={(value) => handleInputChange('interest', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.interest.select')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sponsorship">{t('form.interest.sponsorship')}</SelectItem>
                    <SelectItem value="partnership">{t('form.interest.partnership')}</SelectItem>
                    <SelectItem value="media">{t('form.interest.media')}</SelectItem>
                    <SelectItem value="other">{t('form.interest.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t('contact.message')} *</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder={t('form.messagePlaceholder')}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                disabled={isSubmitting}
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Sending...' : t('contact.send')}
              </Button>

              <p className="text-sm text-gray-600 text-center">
                {t('contact.autoEmail')}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
