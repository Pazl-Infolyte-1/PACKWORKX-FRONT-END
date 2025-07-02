import React from 'react'
import ReusableTable from '../SalesOrder/ReusableTable'
import { useNavigate } from 'react-router-dom'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilPlus, cilTrash } from '@coreui/icons'

const TaskTable = ({ isMinimized, handleEdit, taskData }) => {
  const navigate = useNavigate()
  const columns = [
    { key: 'work_order', header: 'Work Order', field: 'work_order' },
    { key: 'group', header: 'Group', field: 'group' },
    { key: 'task', header: 'Task', field: 'task' },
    {
      key: 'actions',
      header: 'Action',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            {
              label: 'Add Task',
              icon: cilPlus,
              onClick: () => {
                // handleEdit(row)
              },
            },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => {
                // openDeleteModal(row.id)
              },
            },
          ]}
        />
      ),
    },
  ]
  return (
    <div>
      <ReusableTable
        data={taskData}
        columns={columns}
        handleRowClick={(row) => navigate(`/task/view/${row.id}`)}
        miniScreenFields={['id', 'work_order']}
        isMinimiseTable={isMinimized}
      />
    </div>
  )
}

export default TaskTable
