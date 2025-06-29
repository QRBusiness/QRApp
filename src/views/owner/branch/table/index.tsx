import { BRANCH_TABLE } from '@/constants';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type BranchType, columns } from '../../../owner/branch/table/columns';

export default function BranchTypeTable({ data }: { data: BranchType[] }) {
  return <DataTable table_key={BRANCH_TABLE} columns={columns} data={data} />;
}
