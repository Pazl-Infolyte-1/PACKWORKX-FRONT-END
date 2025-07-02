import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TaskView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  return (
    <div>
      <div className="bg-white w-full font-sans flex flex-col" style={{ height: '90vh' }}>
        {/* Fixed Header */}
        <div className="w-full bg-white z-50 flex-shrink-0 border-b shadow-sm">
          <div className="flex justify-between items-center p-2">
            <h1 className="text-lg font-semibold text-gray-800">
              Task : <span className="text-primary">{'N/A'}</span>
            </h1>
            <button
              className="text-gray-500 text-sm p-1 hover:text-gray-800"
              onClick={() => navigate('/task')}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div>Task View</div>
      </div>
    </div>
  )
}

export default TaskView
