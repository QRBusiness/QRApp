import React from 'react';
import { ChevronLeft, SlashIcon } from 'lucide-react';
import path from 'path';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '../ui/button';
import { useViewState } from './states/viewState';
import { ToggleChangeLanguage } from './toggle-change-language';

const AppBreadcrumb = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { id, businessId } = useParams<{ id: string; businessId: string }>();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const { isMobile } = useViewState();

  const renderMobilePathnameLabel = (pathnames: string[]) => {
    if (pathnames[pathnames.length - 1] === id) {
      if (pathnames.length >= 2 && pathnames[pathnames.length - 2] === 'order-management') {
        return t('module.sidebar.order-details');
      }
      return t(`module.sidebar.${pathnames[pathnames.length - 2]}`);
    }
    return t(`module.sidebar.${pathnames[pathnames.length - 1]}`) || path.basename(location.pathname);
  };

  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 w-full z-10 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center px-4 py-3">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => window.history.back()}>
            <ChevronLeft className="size-6" />
          </Button>
          <h1 className="text-xl font-semibold flex-1 text-center">{renderMobilePathnameLabel(pathnames)}</h1>
          <div className="mr-0">
            <ToggleChangeLanguage />
          </div>
        </div>
      </div>
    );
  }
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">{t('module.sidebar.home')}</BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.slice(0, pathnames.length - 1).map((value, index) => {
          const href = `/${pathnames.slice(0, index + 1).join('/')}`;
          return (
            <React.Fragment key={index}>
              {/* If the value is 'qr-management' and id is present, use the id instead */}
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem key={index}>
                <BreadcrumbLink href={href}>
                  {value !== id && value !== businessId
                    ? t(`module.sidebar.${value}`)
                    : value === id
                      ? id
                      : t(`module.sidebar.businessId`)}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
        {pathnames.length >= 1 && (
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>
            {pathnames[pathnames.length - 1] !== id ? t(`module.sidebar.${pathnames[pathnames.length - 1]}`) : id}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
