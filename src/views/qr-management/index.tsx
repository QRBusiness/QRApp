import React from 'react';
import { useViewState } from '@/components/common/states/viewState';
import CreateQR from './create/create-qr';
import MobileTable from './mobile-card';
import QRTable from './table/page';

const QRManagement = () => {
  const { isMobile } = useViewState();

  return (
    <>
      {isMobile ? (
        <MobileTable />
      ) : (
        <React.Fragment>
          <CreateQR />
          <QRTable />
        </React.Fragment>
      )}
    </>
  );
};

export default QRManagement;
