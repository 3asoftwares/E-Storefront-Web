import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface EmptyStateProps {
  icon: IconDefinition;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  iconColor?: string;
  iconBgColor?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  actionHref,
  iconColor = 'text-gray-600',
  iconBgColor = 'from-gray-100 to-gray-200',
}) => {
  return (
    <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg xs:shadow-2xl p-6 xs:p-10 sm:p-16 md:p-20 text-center border border-gray-200">
      <div className={`inline-block p-4 xs:p-5 sm:p-6 bg-gradient-to-br ${iconBgColor} rounded-full mb-4 xs:mb-5 sm:mb-6`}>
        <FontAwesomeIcon icon={icon} className={`w-10 h-10 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 ${iconColor}`} />
      </div>
      <h2 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 xs:mb-3 sm:mb-4">{title}</h2>
      <p className="text-gray-600 mb-6 xs:mb-8 sm:mb-10 text-sm xs:text-base sm:text-lg max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-block px-6 xs:px-8 sm:px-10 py-3 xs:py-3.5 sm:py-4 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-gray-500/50 transition-all transform active:scale-95 pointer:hover:scale-105 pointer:hover:-translate-y-1 text-sm xs:text-base min-h-[48px]"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
