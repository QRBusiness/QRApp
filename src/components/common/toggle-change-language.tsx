import { useState } from 'react';
import EnglandFlag from '@/assets/svg/england-flag-icon.svg';
import VietnamFlag from '@/assets/svg/vietnam-flag-icon.svg';
import { LANGUAGE_STORAGE } from '@/constants';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveToLocalStorage } from '@/libs/utils';

export const ToggleChangeLanguage = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    saveToLocalStorage(LANGUAGE_STORAGE, value);
  };
  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">
          <img src={EnglandFlag} alt="England Flag" className="w-4 h-4 mr-2" />
          English
        </SelectItem>
        <SelectItem value="vi">
          <img src={VietnamFlag} alt="Vietnam Flag" className="w-4 h-4 mr-2" />
          Tiếng Việt
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
