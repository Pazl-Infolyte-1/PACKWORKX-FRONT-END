import { capitalize } from 'lodash'
import ReusableTable from '../SalesOrder/ReusableTable'
import { render } from 'sass'
import { useNavigate } from 'react-router-dom'

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
  },
  {
    key: 'status',
    field: 'status',
    header: 'Status',
    type: 'custom',
    render: (row) => (
      <span
        className={`flex items-center justify-center w-[80px] px-2 py-1 rounded-full text-xs font-semibold
          ${
            row.status === 'completed'
              ? 'bg-green-100 text-black'
              : row.status === 'uploaded'
                ? 'bg-indigo-400 text-white'
                : row.status === 'failed'
                  ? 'bg-red-600 text-white'
                  : ''
          }
        `}
      >
        {capitalize(row.status)}
      </span>
    ),
  },
]

function ModuleTable({ modules, isMinimized, setIsMinimized }) {
  const naviagte = useNavigate()

  const handleNavigate = (row) => {
    setIsMinimized(true)
    naviagte(`/data_transfer/${row.id}`)
  }
  return (
    <ReusableTable
      columns={columns}
      data={modules}
      isMinimiseTable={isMinimized}
      height="calc(85vh - 74px)"
      handleRowClick={(row) => {
        handleNavigate(row)
      }}
      miniScreenFields={['module_name', 'created_at']}
    />
  )
}

export default ModuleTable
