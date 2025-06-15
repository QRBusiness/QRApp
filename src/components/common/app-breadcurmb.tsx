import React from 'react';
import { ChevronLeft, SlashIcon } from 'lucide-react';
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

const AppBreadcrumb = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const { isMobile } = useViewState();
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 w-full z-10 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="size-6" />
          </Button>
          <h1 className="text-xl font-semibold flex-1 text-center">
            {t(`module.sidebar.${pathnames[pathnames.length - 1]}`)}
          </h1>
          <div className="w-10"></div> {/* Spacer for balance */}
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
                  {value !== id ? t(`module.sidebar.${value}`) : id}
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
            {pathnames[pathnames.length - 1] !== id
              ? t(`module.sidebar.${pathnames[pathnames.length - 1]}`)
              : id}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
