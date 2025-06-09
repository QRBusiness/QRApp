import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { type QRTable, columns } from './columns';
import { DataTable } from './data-table';

async function getData(): Promise<QRTable[]> {
  // Fetch data from your API here.
  return [
    {
      id: '1',
      table: 'Table 1',
      area: 'Area A',
      status: 'ordering',
      available: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      table: 'Table 2',
      area: 'Area B',
      status: 'staff call',
      available: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      table: 'Table 3',
      area: 'Area C',
      status: 'paid',
      available: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

export default function QRTable() {
  const [data, setData] = useState<QRTable[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container py-10">
      <h4 className="mb-4 scroll-m-20 text-2xl font-semibold tracking-tight">
        {t('module.qrManagement.table.title')}
      </h4>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
