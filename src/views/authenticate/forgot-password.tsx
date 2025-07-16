import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('module.forgotPassword.title')}</h1>
      <p>{t('module.forgotPassword.description')}</p>
    </div>
  );
};

export default ForgotPassword;
