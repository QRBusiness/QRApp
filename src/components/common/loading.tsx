import { Loader2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Loading = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-row space-x-2 items-center">
        <Loader2Icon className="animate-spin text-primary" strokeWidth={1.5} />
        <span className="text-primary font-normal text-lg italic">{t('module.common.loading')}</span>
      </div>
    </div>
  );
};

export default Loading;
