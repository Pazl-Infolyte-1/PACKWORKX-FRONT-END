import ReusableTable from '../SalesOrder/ReusableTable'

const mockModules = [
  { id: 1, name: 'Inventory Management', created_at: '2023-01-15', status: 'active' },
  { id: 2, name: 'Human Resource', created_at: '2023-02-20', status: 'active' },
  { id: 3, name: 'Financials', created_at: '2023-03-10', status: 'inactive' },
  { id: 4, name: 'Sales & Marketing', created_at: '2023-04-05', status: 'active' },
  { id: 5, name: 'Reporting', created_at: '2023-05-21', status: 'inactive' },
]

const columns = [
  {
    key: 'name',
    field: 'name',
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
          row.status === 'active'
            ? 'bg-green-100 text-green-800 px-4'
            : 'bg-red-100 text-red-800 px-4'
        }`}
      >
        {row.status === 'active' ? 'Active' : 'Inactive'}
      </span>
    ),
  },
]

function ModuleTable({ modules, isMinimized }) {
  return (
    <ReusableTable
      columns={columns}
      data={mockModules}
      isMinimiseTable={isMinimized}
      height="calc(85vh - 74px)"
    />
  )
}

export default ModuleTable
