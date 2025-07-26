import React, { useEffect } from 'react';
import { type AreaResponse, getAreas } from '@/services/owner/area-service';
import { useBranches } from '@/services/owner/branch-service';
import { useTables } from '@/services/owner/table-service';
import { ChevronLeft, FunnelPlus, FunnelX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserPermissions } from '@/components/common/states/userState';
import { useViewState } from '@/components/common/states/viewState';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { havePermissions } from '@/libs/utils';
import { CustomVariantsSelect } from '../menu-management/dialog/custom-variants-select';
import CreateQR from './create/create-qr';
import MobileTable from './mobile-card';
import { type QRTable as QRTableType } from './table/columns';
import QRTable from './table/page';

const QRManagement = () => {
  const { isMobile } = useViewState();
  const { t } = useTranslation();
  const { permissions } = useUserPermissions();
  const [selectedArea, setSelectedArea] = React.useState<string>('');
  const [selectedBranch, setSelectedBranch] = React.useState<string>('');
  const [areaOptions, setAreaOptions] = React.useState<{ value: string; label: string }[]>([]);

  const permissionsCodes = permissions.map((permission) => permission.code);

  const { branches } = useBranches({
    page: 1,
    limit: 50,
  });

  const branchOptions = branches.map((branch) => ({
    value: branch._id,
    label: branch.name,
  }));

  const { tables, refetch } = useTables({
    page: 1,
    limit: 50,
    branch: selectedBranch,
    area: selectedArea,
  });

  const formatedTables: QRTableType[] = tables.map((table) => ({
    _id: table._id,
    name: table.name,
    qr_code: table.qr_code,
    area: typeof table.area === 'string' ? table.area : table.area?.name || '',
    branch: table.area.branch.name,
    available: typeof table.available === 'boolean' ? table.available : true,
    created_at: table.created_at,
    updated_at: table.updated_at,
  }));

  const handleBranchChange = async (value: string) => {
    setSelectedBranch(value);
    const response = await getAreas({
      page: 1,
      limit: 50,
      branch: value,
    });
    setAreaOptions(
      response.map((area: AreaResponse) => ({
        value: area._id,
        label: area.name,
      }))
    );
  };

  const handleClearFilters = () => {
    setSelectedArea('');
    setSelectedBranch('');
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch();
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [selectedBranch, selectedArea, refetch]);

  const Filters = () => {
    return (
      <div className="flex items-start justify-start gap-2 flex-col p-2 md:p-3 border rounded-lg w-full">
        <div className="flex items-center justify-between space-x-2 w-full">
          <div className="flex items-center space-x-2">
            <FunnelPlus className="size-4 md:size-5" />
            <Label className="font-semibold text-base ">{t('module.filter.title')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearFilters}
              disabled={selectedArea === '' && selectedBranch === ''}
            >
              <FunnelX className="size-4 md:size-5" />
              {t('module.filter.button.clear')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 w-full items-center justify-between flex-wrap gap-2">
          <div className="flex flex-col items-start justify-center space-y-2">
            <Label className="text-muted-foreground">{t('module.filter.branch.label')}</Label>
            <CustomVariantsSelect
              options={branchOptions}
              value={selectedBranch}
              onChange={handleBranchChange}
              placeholder={t('module.filter.branch.placeholder')}
            />
          </div>
          <div className="flex flex-col items-start justify-center space-y-2">
            <Label className="text-muted-foreground">{t('module.filter.area.label')}</Label>
            <CustomVariantsSelect
              options={areaOptions}
              value={selectedArea}
              onChange={setSelectedArea}
              placeholder={t('module.filter.area.placeholder')}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isMobile ? (
        <div className="w-full mx-auto flex flex-col gap-4">
          <div className="p-2">
            <Filters />
          </div>
          <MobileTable />
        </div>
      ) : (
        <div className="w-full p-4 mx-auto flex flex-col gap-4">
          {havePermissions(permissionsCodes, ['create.serviceunit']) && (
            <Collapsible className="group/collapsible" defaultOpen={false} key={'create-qr-collapsible'}>
              <CollapsibleTrigger asChild>
                <Button variant="secondary">
                  <p>{t('module.qrManagement.createCollapse')}</p>
                  <ChevronLeft className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="py-4">
                <CreateQR />
              </CollapsibleContent>
            </Collapsible>
          )}
          <Filters />
          <QRTable data={formatedTables} />
        </div>
      )}
    </>
  );
};

export default QRManagement;
