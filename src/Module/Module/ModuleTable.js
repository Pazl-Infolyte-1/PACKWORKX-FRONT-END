import { capitalize } from 'lodash'
import ReusableTable from '../SalesOrder/ReusableTable'
import { render } from 'sass'

const columns = [
  {
    key: 'module_name',
    field: 'module_name',
    header: 'Module',
    render: (row) => <p className="text-start">{capitalize(row.module_name)}</p>,
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
        className={`text-center px-2 py-1 -ml-72 rounded-full text-xs font-semibold w-[70px] ${
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
