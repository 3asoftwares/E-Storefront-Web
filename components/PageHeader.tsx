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
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-4 xs:pt-6 sm:pt-8">
      <div className="flex xs:items-center justify-between gap-2 xs:gap-4 mb-2">
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
            <div className={`p-2.5 xs:p-3 sm:p-4 bg-gradient-to-br ${iconGradient} rounded-xl xs:rounded-2xl shadow-lg flex-shrink-0`}>
              <FontAwesomeIcon icon={icon} className="w-4 h-4 xs:w-5 xs:h-5 text-white" />
            </div>
            <h1
              className={`text-xl xs:text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${titleGradient}`}
            >
              {title}
            </h1>
          </div>
          {(subtitle || badge) && (
            <div className="text-gray-700 text-sm xs:text-base sm:text-lg font-medium flex items-center gap-2 ml-0 xs:ml-auto">
              {badge && (
                <span
                  className={`w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-gradient-to-br ${iconGradient} rounded-full flex items-center justify-center text-white text-xs xs:text-sm font-bold`}
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
