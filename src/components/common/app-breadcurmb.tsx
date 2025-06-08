import React from 'react';
import { SlashIcon } from 'lucide-react';
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

const AppBreadcrumb = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const pathnames = location.pathname.split('/').filter((x) => x);
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
