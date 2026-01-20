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
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg xs:rounded-2xl xs:p-10 xs:shadow-2xl sm:p-16 md:p-20">
      <div
        className={`inline-block bg-gradient-to-br p-4 xs:p-5 sm:p-6 ${iconBgColor} mb-4 rounded-full xs:mb-5 sm:mb-6`}
      >
        <FontAwesomeIcon
          icon={icon}
          className={`h-10 w-10 xs:h-14 xs:w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 ${iconColor}`}
        />
      </div>
      <h2 className="mb-2 text-xl font-extrabold text-gray-900 xs:mb-3 xs:text-2xl sm:mb-4 sm:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-gray-600 xs:mb-8 xs:text-base sm:mb-10 sm:text-lg">
        {description}
      </p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-block min-h-[48px] transform rounded-xl bg-gradient-to-r from-gray-900 to-black px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-2xl hover:shadow-gray-500/50 active:scale-95 xs:px-8 xs:py-3.5 xs:text-base sm:px-10 sm:py-4 pointer:hover:-translate-y-1 pointer:hover:scale-105"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
