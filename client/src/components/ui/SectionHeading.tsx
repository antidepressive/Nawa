interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionHeading = ({ title, subtitle, centered = true }: SectionHeadingProps) => {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
      <h2 className="font-montserrat md:text-5xl text-primary mb-4 font-extrabold text-[54px]">
        {title}
      </h2>
      <div className={`w-24 h-1 bg-accent mb-6 ${centered ? 'mx-auto' : ''}`}></div>
      {subtitle && (
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};
