import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface PageHeaderProps {
  icon: IconDefinition;
  title: string;
  subtitle?: any;
  badge?: {
    count: number;
    label: string;
  };
  iconGradient?: string;
  titleGradient?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  subtitle,
  badge,
  iconGradient = 'from-indigo-500 to-purple-500',
  titleGradient = 'from-indigo-600 to-purple-600',
}) => {
  return (
    <div className="mx-auto max-w-7xl px-3 pt-4 xs:px-4 xs:pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <div className="mb-2 flex justify-between gap-2 xs:items-center xs:gap-4">
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
          <div
            className={`bg-gradient-to-br p-2.5 xs:p-3 sm:p-4 ${iconGradient} flex-shrink-0 rounded-xl shadow-lg xs:rounded-2xl`}
          >
            <FontAwesomeIcon icon={icon} className="h-4 w-4 text-white xs:h-5 xs:w-5" />
          </div>
          <h1
            className={`bg-gradient-to-r bg-clip-text text-xl font-extrabold text-transparent xs:text-2xl sm:text-3xl ${titleGradient}`}
          >
            {title}
          </h1>
        </div>
        {(subtitle || badge) && (
          <div className="ml-0 flex items-center gap-2 text-sm font-medium text-gray-700 xs:ml-auto xs:text-base sm:text-lg">
            {badge && (
              <span
                className={`h-6 w-6 bg-gradient-to-br xs:h-7 xs:w-7 sm:h-8 sm:w-8 ${iconGradient} flex items-center justify-center rounded-full text-xs font-bold text-white xs:text-sm`}
              >
                {badge.count > 99 ? '99+' : badge.count}
              </span>
            )}
            {subtitle || (badge && `${badge.label}`)}
          </div>
        )}
      </div>
    </div>
  );
};
