import { useEffect, useState } from 'react';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type QRTable, columns } from './columns';

async function getData(): Promise<QRTable[]> {
  // Fetch data from your API here.
  return [
    {
      id: 'TBL-2025-0642',
      table: 'Conference Room A',
      area: 'East Wing, 3rd Floor',
      status: 'cancelled',
      available: true,
      createdAt: '2025-06-08T14:30:00Z',
    },
    {
      id: 'TBL-2025-0643',
      table: 'Executive Meeting Room',
      area: 'West Wing, 5th Floor',
      status: 'cancelled',
      available: false,
      createdAt: '2025-06-07T09:15:00Z',
    },
    {
      id: 'TBL-2025-0644',
      table: 'Collaboration Space',
      area: 'North Building, Ground Floor',
      status: 'paid',
      available: true,
      createdAt: '2025-06-09T10:45:00Z',
    },
    {
      id: 'TBL-2025-0645',
      table: 'Training Room B',
      area: 'South Wing, 2nd Floor',
      status: 'staff call',
      available: true,
      createdAt: '2025-06-05T16:20:00Z',
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
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
