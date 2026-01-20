interface SectionHeaderProps {
  badge?: {
    icon: React.ReactNode;
    text: string;
    bgColor?: string;
    textColor?: string;
  };
  title: string;
  description?: string;
  titleGradient?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  description,
  titleGradient = 'from-indigo-600 to-pink-600',
}) => {
  return (
    <div className="mb-6 px-2 text-center xs:mb-8 xs:px-0 sm:mb-12">
      {badge && (
        <div
          className={`inline-block px-3 py-1.5 xs:px-4 xs:py-2 ${badge.bgColor || 'bg-indigo-100'} ${badge.textColor || 'text-indigo-700'} mb-3 rounded-full text-xs font-semibold xs:mb-4 xs:text-sm`}
        >
          {badge.icon}
          {badge.text}
        </div>
      )}
      <h2
        className={`mb-2 bg-gradient-to-r bg-clip-text text-2xl font-extrabold text-gray-900 text-transparent xs:mb-3 xs:text-3xl sm:mb-4 sm:text-4xl md:text-5xl ${titleGradient}`}
      >
        {title}
      </h2>
      <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 xs:text-base sm:text-lg">
        {description}
      </p>
    </div>
  );
};
