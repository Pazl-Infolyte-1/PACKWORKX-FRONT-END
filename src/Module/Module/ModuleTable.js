import { capitalize } from 'lodash'
import ReusableTable from '../SalesOrder/ReusableTable'

const mockModules = [
  { id: 1, module_name: 'Inventory Management', created_at: '2023-01-15', status: 'completed' },
  { id: 2, module_name: 'Human Resource', created_at: '2023-02-20', status: 'completed' },
  { id: 3, module_name: 'Financials', created_at: '2023-03-10', status: 'inactive' },
  { id: 4, module_name: 'Sales & Marketing', created_at: '2023-04-05', status: 'completed' },
  { id: 5, module_name: 'Reporting', created_at: '2023-05-21', status: 'inactive' },
]

const columns = [
  {
    key: 'module_name',
    field: 'module_name',
    header: 'Module',
  },
  {
    key: 'created_at',
    field: 'created_at',
    header: 'Date',
    type: 'date',
  },
  {
    key: 'status',
    field: 'status',
    header: 'Status',
    type: 'custom',
    render: (row) => (
      <span
        className={`text-center px-2 py-1 -ml-48 rounded-full text-xs font-semibold w-[70px] ${
          row.status === 'completed'
            ? 'bg-green-100 text-green-800 px-4'
            : 'bg-red-100 text-red-800 px-4'
        }`}
      >
        {capitalize(row.status)}
      </span>
    ),
  },
]

function ModuleTable({ modules, isMinimized }) {
  return (
    <ReusableTable
      columns={columns}
      data={modules}
      isMinimiseTable={isMinimized}
      height="calc(85vh - 74px)"
    />
  )
}

export default ModuleTable
