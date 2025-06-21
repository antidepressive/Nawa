import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { SectionHeading } from "../ui/SectionHeading";
import { useToast } from "../../hooks/use-toast";
import { MapPin, Phone, Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

interface FormData {
  name: string;
  organization: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

export const Contact = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    organization: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+966[5-9]\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Phone number must be in format +966xxxxxxxxx";
    }
    
    if (!formData.interest) {
      newErrors.interest = "Please select your area of interest";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();

      toast({
        title: "Message Sent!",
        description:
          "Thank you for your interest. We'll get back to you soon and send you our sponsorship deck.",
      });

      // Reset form
      setFormData({
        name: "",
        organization: "",
        email: "",
        phone: "",
        interest: "",
        message: "",
      });
      setErrors({});
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
    <section id="contact" className="py-20 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("contact.title")}
          subtitle={t("contact.subtitle")}
        />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="font-montserrat font-bold text-2xl text-primary mb-6 text-center">
                {t("contact.letsConnect")}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 text-center">
                {t("contact.description")}
              </p>
            </div>

            <div className="space-y-8 mt-[32px] mb-[32px] flex flex-col items-center">
              <div className={`flex items-start ${language === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'} w-full max-w-sm`}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                  <h4 className={`font-semibold text-text-dark mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t("contact.phone")}
                  </h4>
                  <p className="text-gray-600 arabic-numbers">
                    {t("contact.phoneValue")}
                  </p>
                </div>
              </div>

              <div className={`flex items-start ${language === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'} w-full max-w-sm`}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                  <h4 className={`font-semibold text-text-dark mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t("contact.email")}
                  </h4>
                  <p className="text-gray-600">{t("contact.emailValue")}</p>
                </div>
              </div>

              <a
                href="https://wa.me/966538104164"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}
              >
                <MessageSquare className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t("contact.whatsapp")}
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="font-montserrat font-bold text-2xl text-primary mb-6 text-center">
              {t("contact.formTitle")}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("contact.name")} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    disabled={isSubmitting}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">
                    {t("contact.organization")}
                  </Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) =>
                      handleInputChange("organization", e.target.value)
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("contact.email")} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    disabled={isSubmitting}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("contact.phone")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+966xxxxxxxxx"
                    disabled={isSubmitting}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest">{t("contact.interest")} *</Label>
                <Select
                  value={formData.interest}
                  onValueChange={(value) =>
                    handleInputChange("interest", value)
                  }
                  required
                >
                  <SelectTrigger className={errors.interest ? "border-red-500" : ""}>
                    <SelectValue placeholder={t("form.interest.select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sponsorship">
                      {t("form.interest.sponsorship")}
                    </SelectItem>
                    <SelectItem value="partnership">
                      {t("form.interest.partnership")}
                    </SelectItem>
                    <SelectItem value="media">
                      {t("form.interest.media")}
                    </SelectItem>
                    <SelectItem value="other">
                      {t("form.interest.other")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.interest && (
                  <p className="text-red-500 text-sm">{errors.interest}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t("contact.message")} *</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder={t("form.messagePlaceholder")}
                  required
                  disabled={isSubmitting}
                  className={errors.message ? "border-red-500" : ""}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                disabled={isSubmitting}
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? "Sending..." : t("contact.send")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
