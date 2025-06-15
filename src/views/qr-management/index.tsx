import React from 'react';
import { useViewState } from '@/components/common/states/viewState';
import CreateQR from './create/create-qr';
import MobileTable from './mobile-card';
import QRTable from './table/page';

const QRManagement = () => {
  const { isMobile } = useViewState();

  return (
    <div className="flex flex-col items-start justify-start w-full h-full px-0 py-4">
      {/* desktop view */}
      {isMobile ? (
        <MobileTable />
      ) : (
        <React.Fragment>
          <CreateQR />
          <QRTable />
        </React.Fragment>
      )}
    </div>
  );
};

export default QRManagement;
