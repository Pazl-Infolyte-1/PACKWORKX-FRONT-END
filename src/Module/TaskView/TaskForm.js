import { useNavigate } from "react-router-dom";



const TaskForm=()=>{
	const navigate = useNavigate()
	 const handleSubmit = (e) => {
    e.preventDefault();
    // your submit logic
  };

  const handleCancel = () => {
    // your cancel logic
	navigate('/task')
  };


	return (<>
 <form onSubmit={handleSubmit} className="relative min-h-screen bg-gray-50">
      {/* Main Form Container */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Work Order Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Work Order Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Work Order ID</label>
              <input type="text" className="mt-1 w-full border px-3 py-2 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Client</label>
              <input type="text" className="mt-1 w-full border px-3 py-2 rounded-md text-sm" />
            </div>
          </div>
        </div>

        {/* Group Info Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Group Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Group Name</label>
              <input type="text" className="mt-1 w-full border px-3 py-2 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Group Leader</label>
              <input type="text" className="mt-1 w-full border px-3 py-2 rounded-md text-sm" />
            </div>
          </div>
        </div>

        {/* Task Info Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Task Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Task Name</label>
              <input type="text" className="mt-1 w-full border px-3 py-2 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input type="date" className="mt-1 w-full border px-3 py-2 rounded-md text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Buttons */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex justify-end gap-2 shadow">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
		onClick={handleSubmit}
          type="submit"
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
	</>)
}

export default TaskForm