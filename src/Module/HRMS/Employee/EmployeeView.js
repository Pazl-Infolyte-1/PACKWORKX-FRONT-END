import React from 'react';
import PopUp from '../../../components/New/PopUp';

function EmployeeView({ employeeData, showEmployeeData, setVisible }) {
  if (!employeeData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const skillsList = employeeData.skills ? employeeData.skills.split(',') : [];

  return (
    <PopUp
      visible={showEmployeeData}
      showCloseButton={true}
      setVisible={() => setVisible(false)}
      height={'95vh'}
      width={'70vw'}
    >
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header with Employee Image */}
          <header className="mb-8">
            <div className="flex items-start gap-6">
              {/* Employee Image */}
              <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm flex-shrink-0">
                <img 
                  src={employeeData.image || "/api/placeholder/128/128"} 
                  alt={`${employeeData.user_name}`} 
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">{employeeData.user_name}</h1>
                    <p className="text-gray-500 mt-1">#{employeeData.employee_id}</p>
                  </div>
                  <div className="mt-2 sm:mt-0  ">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        employeeData.employment_type === 'Full-time'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {employeeData.employment_type}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        employeeData.user_status === 'active'
                          ? 'bg-green-800 text-white'
                          : 'bg-red-700 text-white '
                      }`}
                    >
                      {employeeData.user_status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8">
            {/* Primary Information Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Full Name</span>
                    <span className="text-gray-800 mt-1">{employeeData.user_name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Email</span>
                    <span className="text-gray-800 mt-1">{employeeData.user_email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Phone</span>
                    <span className="text-gray-800 mt-1">{employeeData.mobile}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Address</span>
                    <span className="text-gray-800 mt-1">{employeeData.address}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Date of Birth</span>
                    <span className="text-gray-800 mt-1">{formatDate(employeeData.date_of_birth)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Marital Status</span>
                    <span className="text-gray-800 mt-1 capitalize">{employeeData.marital_status || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Details Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Employment Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Employee ID</span>
                    <span className="text-gray-800 mt-1">{employeeData.employee_id}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Department ID</span>
                    <span className="text-gray-800 mt-1">{employeeData.department_id}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Designation ID</span>
                    <span className="text-gray-800 mt-1">{employeeData.designation_id}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Role ID</span>
                    <span className="text-gray-800 mt-1">{employeeData.role_id}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Employment Type</span>
                    <span className="text-gray-800 mt-1">{employeeData.employment_type}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">User ID</span>
                    <span className="text-gray-800 mt-1">{employeeData.user_id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout for Dates & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Dates & Contract Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Dates & Contract</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Joining Date</span>
                      <span className="text-gray-800 mt-1">{formatDate(employeeData.joining_date)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Contract End Date</span>
                      <span className="text-gray-800 mt-1">{formatDate(employeeData.contract_end_date)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Last Date</span>
                      <span className="text-gray-800 mt-1">{formatDate(employeeData.last_date)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Probation End Date</span>
                      <span className="text-gray-800 mt-1">{formatDate(employeeData.probation_end_date)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.length > 0 ? skillsList.map((skill, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                      >
                        {skill.trim()}
                      </span>
                    )) : <span className="text-gray-500">No skills listed</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Notice Period Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Notice Period</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Start Date</span>
                    <span className="text-gray-800 mt-1">{formatDate(employeeData.notice_period_start_date)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">End Date</span>
                    <span className="text-gray-800 mt-1">{formatDate(employeeData.notice_period_end_date)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Record Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Created At</span>
                    <span className="text-gray-800 mt-1">{new Date(employeeData.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Updated At</span>
                    <span className="text-gray-800 mt-1">{new Date(employeeData.updated_at).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Company ID</span>
                    <span className="text-gray-800 mt-1">{employeeData.company_id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PopUp>
  );
}

export default EmployeeView;