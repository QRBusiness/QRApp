import React, { useEffect } from 'react';
import { useTables } from '@/services/owner/table-service';
import { useViewState } from '@/components/common/states/viewState';
import CreateQR from './create/create-qr';
import MobileTable from './mobile-card';
import { type QRTable as QRTableType } from './table/columns';
import QRTable from './table/page';

const QRManagement = () => {
  const { isMobile } = useViewState();
  const [data, setData] = React.useState<QRTableType[]>([]);
  const { tables } = useTables({
    page: 1,
    limit: 50,
  });

  useEffect(() => {
    if (tables && tables.length > 0) {
      setData(
        tables.map((table) => ({
          _id: table._id,
          name: table.name,
          qr_code: table.qr_code,
          area: typeof table.area === 'string' ? table.area : table.area?.name || '', // Use area name or fallback
          branch: table.area.branch.name,
          available: typeof table.available === 'boolean' ? table.available : true,
          created_at: table.created_at,
          updated_at: table.updated_at,
        }))
      );
    }
  }, [tables]);

  return (
    <>
      {isMobile ? (
        <MobileTable />
      ) : (
        <React.Fragment>
          <CreateQR />
          <QRTable data={data} />
        </React.Fragment>
      )}
    </>
  );
};

export default QRManagement;
