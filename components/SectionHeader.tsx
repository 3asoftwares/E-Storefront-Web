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
    <div className="mb-6 xs:mb-8 sm:mb-12 text-center px-2 xs:px-0">
      {badge && (
        <div className={`inline-block px-3 xs:px-4 py-1.5 xs:py-2 ${badge.bgColor || 'bg-indigo-100'} ${badge.textColor || 'text-indigo-700'} rounded-full text-xs xs:text-sm font-semibold mb-3 xs:mb-4`}>
          {badge.icon}
          {badge.text}
        </div>
      )}
      <h2 className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 xs:mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r ${titleGradient}`}>
        {title}
      </h2>
      <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
};
