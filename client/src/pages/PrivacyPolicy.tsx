import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function PrivacyPolicy() {
  const { t } = useLanguage(); // still gives you translated page-title etc.
  const [html, setHtml] = useState("");

  useEffect(() => {
    document.title = 'Nawa - نَوَاة';
    // Fetch pre-converted HTML file from /public
    fetch("/assets/privacy_policy.html")
      .then((res) => res.text())
      .then(setHtml)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="font-montserrat font-bold text-4xl text-primary mb-8">
          {t("privacy.title")} {/* e.g. “Privacy Policy” / “سياسة الخصوصية” */}
        </h1>

        {/* Render the policy */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
