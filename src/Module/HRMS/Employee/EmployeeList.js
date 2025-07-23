import { useState, useEffect, use, useRef } from 'react'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import { TbSmartHome } from 'react-icons/tb'
import CompactPagination from '../../../components/New/CompactPagination'
import EmployeeTable from './EmployeeTable'
import ActionButton from '../../../components/New/ActionButton'
import SearchBar from '../../../components/New/SearchBar'
import EmployeeView from './EmployeeView'
import { useSearch } from '../../../components/New/SearchContext'
import CustomAlert from '../../../components/New/CustomAlert'
import ContentHeader from '../../../components/New/ContentHeader'
import { FiDownload, FiUpload } from 'react-icons/fi'
import { companyApi } from '../../../api/company'
import { commonApi } from '../../../api/common'
import { employeeApi } from '../../../api/employee'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

function EmployeeList() {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isEdit, setIsEdit] = useState(false)
  const rowsPerPage = 10
  const [employeesData, setEmployeesData] = useState([])
  const [CurrentEmployeeId, setCurrentEmployeeId] = useState(null)
  const [EmployeeResponse, setEmployeeResponse] = useState(null)
  const [totalCount, setTotalCount] = useState(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showEmployeeData, setShowEmployeeData] = useState(false)
  const [viewEmployeeData, setViewEmployeeData] = useState(null)
  const { searchQuery, setGlobalPlaceholder, handleSearch } = useSearch()
  const [status, setFilterStatus] = useState('')
  const [alerts, setAlerts] = useState([])
  const searchBarRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const [filters, setFilters] = useState({
    department: '',
    role: '',
    status: '',
  })
  const [paginationParams, setPaginationParams] = useState({
    currentPage: 1,
    pageSize: 50,
  })

  const [dropdownOptions, setDropdownOptions] = useState({
    countries: [],
    companiesAddresses: [],
    departments: [],
    designations: [],
    roles: [],
    reporting_to: [
      { id: 3, name: 'Jane Smith' },
      { id: 3, name: 'Mike Johnson' },
      { id: 3, name: 'Sarah Williams' },
    ],
  })

  const navigate = useNavigate()

  const defaultFormState = {
    name: '',
    email: '',
    password: '',
    mobile: '',
    employee_id: '',
    address: '',
    skills: '',
    department_id: null,
    designation_id: null,
    joining_date: '',
    date_of_birth: '',
    about_me: '',
    reporting_to: null,
    contract_end_date: '',
    employment_type: '',
    company_address_id: null,
    role_id: null,
    image: '',
    country_phonecode: null,
    country_id: null,
  }
  const [formData, setFormData] = useState(defaultFormState)

  useEffect(() => {
    const fetchDropDownData = async () => {
      try {
        const [
          countriesResponse,
          companiesAddressResponse,
          departmentsResponse,
          designationsResponse,
          rolesResponse,
        ] = await Promise.all([
          commonApi.getCountries(),
          companyApi.getCompanyAddress(),
          employeeApi.getDepartmentsList(),
          employeeApi.getDesignation(),
          employeeApi.getRoles(),
        ])

        setDropdownOptions({
          countries: countriesResponse?.data?.data,
          companiesAddresses: companiesAddressResponse?.data?.data,
          departments: departmentsResponse?.data?.data,
          designations: designationsResponse?.data?.data,
          roles: rolesResponse?.data?.data,
        })
      } catch (error) {
        console.error('Error fetching dropdown data:', error)
      }
    }

    fetchDropDownData()
  }, [])

  useEffect(() => {
    setGlobalPlaceholder('Search Employees...')

    return () => {
      setGlobalPlaceholder('Search...')
    }
  }, [])

  useEffect(() => {
    if (location.pathname === '/employeelist') {
      setIsMinimized(false)
    } else {
      setIsMinimized(true)
    }
  }, [location.pathname])

  useEffect(() => {
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: 1, // Reset to page 1 whenever search query changes
    }))
  }, [searchQuery, status])

  // Initial data fetch on component mount
  useEffect(() => {
    fetchEmployeeData()
  }, [paginationParams, searchQuery, status, filters])

  const handleEdit = (id, userId) => {
    navigate(`/employeelist/form/${id}`)
  }

  const handlePageChange1 = (event, newPage) => {
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: newPage,
    }))
  }

  const handleLimitChange1 = (newLimit) => {
    setPaginationParams({
      currentPage: 1, // Always reset to page 1 when changing limit
      pageSize: newLimit,
    })
  }

  const HandleFilter = (e) => {
    const selectedValue = e.target.value
    const selectedDropdownId = e.target.id

    // Determine filter type based on dropdown ID
    let filterType = ''
    if (selectedDropdownId === 'department-filter') {
      filterType = 'department'
    } else if (selectedDropdownId === 'role-filter') {
      filterType = 'role'
    } else if (selectedDropdownId === 'status-filter') {
      filterType = 'status'
    }

    // Update filters state
    const newFilters = {
      ...filters,
      [filterType]: selectedValue,
    }
    setFilters(newFilters)


    // Reset pagination to first page when filtering
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: 1,
    }))
  }

  const fetchEmployeeData = async () => {
    setLoading(true)
    try {
      const response = await employeeApi.GetEmployeelist({
        search: searchQuery,
        page: paginationParams.currentPage,
        limit: paginationParams.pageSize,
        status: status,
        department: filters.department,
        role: filters.role,
      })
      setEmployeesData(response.data.data)
      setEmployeeResponse(response.data)
      setTotalCount(response.data.totalRecords)
    } catch (error) {
      console.error('Error fetching employee data:', error)
      setAlerts([
        {
          severity: 'error',
          message:
            error?.response?.data?.message || 'Failed to fetch employee data. Please try again.',
        },
      ])
      setEmployeesData([])
      setEmployeeResponse(null)
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (id) => {
    try {
      const response = await employeeApi.getEmployeeData(id)
      setViewEmployeeData(response.data.data)
      setShowEmployeeData(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleStatus = (event) => {
    setFilterStatus(event.target.value)
  }

  const handleClose = () => {
    setAlerts([])
  }

  const clearFilters = () => {
    document.querySelectorAll('.filter-dropdown').forEach((dropdown) => {
      dropdown.value = ''
    })

    setFilters({
      department: '',
      role: '',
      status: '',
    })
    setFilterStatus('')

    if (searchBarRef.current && searchBarRef.current.clearSearch) {
      searchBarRef.current.clearSearch()
    }

    // Reset pagination
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: 1,
    }))
  }
  return (
    <div className="flex">
      {/* Left Side - All Current Content */}
      <div className={` ${isMinimized ? 'w-1/4' : 'w-full'}`}>
        <CustomAlert alerts={alerts} handleClose={handleClose} />
        <ContentHeader
          heading={'Employee'}
          onAddClick={() => navigate('/employeelist/form')}
          menuOptions={[
            {
              icon: <FiDownload className="mr-2 text-blue-500" />,
              label: 'Export',
              onClick: () => console.log('Export clicked'),
            },
          ]}
        />

        <div className="">
          {!isMinimized && (
            <div className=" flex items-center justify-between mt-1.5 border border-gray-300 rounded-md py-1">
              <div className="flex gap-8 ml-5 text-sm">
                <div className="flex gap-1.5 items-center">
                  <TbSmartHome className="text-teal-500" />
                  <span>Total Employees</span>
                  <span className="bg-teal-500 text-white text-xs rounded-md h-6 w-10 flex justify-center items-center">
                    {EmployeeResponse?.totalRecords || 0}
                  </span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <IoCheckmarkCircleOutline />
                  <span>Active</span>
                  <span className="bg-teal-500 text-white  text-xs rounded-md h-6 w-10 flex justify-center items-center">
                    {EmployeeResponse?.activeEmployees || 0}{' '}
                  </span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <IoCheckmarkCircleOutline />
                  <span>Inactive</span>
                  <span className="bg-teal-500 text-white  text-xs rounded-md h-6 w-10 flex justify-center items-center">
                    {EmployeeResponse?.inactiveEmployees || 0}
                  </span>
                </div>
              </div>
              <div className=" mt-1 flex justify-between gap-2 mx-2">
                {/* <div className='flex gap-3'> */}
                <div className="flex justify-end flex-wrap  gap-3 text-sm">
                  <select
                    id="department-filter"
                    className="bg-white border border-[#e7e5e4] p-[6px] h-[35px] rounded-md filter-dropdown"
                    value={filters.department}
                    onChange={HandleFilter}
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    {dropdownOptions.departments.map((department) => (
                      <option key={department.id} value={department.department_name}>
                        {department.department_name}
                      </option>
                    ))}
                  </select>

                  <select
                    id="role-filter"
                    className="border border-[#e7e5e4] p-[6px] h-[35px] rounded-md filter-dropdown"
                    value={filters.role}
                    onChange={HandleFilter}
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    {dropdownOptions.roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>

                  <select
                    id="status-filter"
                    className="border border-[#e7e5e4] p-[6px] h-[35px] rounded-md"
                    value={status || ''}
                    onChange={handleStatus}
                  >
                    <option value="" disabled>
                      status
                    </option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <button
                    className="border border-[#e7e5e4] bg-white text-gray-700 px-2  h-[35px] rounded-md hover:bg-gray-200 transition flex items-center gap-1"
                    onClick={clearFilters}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Clear
                  </button>
                </div>
                {/* </div> */}
              </div>
            </div>
          )}

          <div>
            <div>
              <EmployeeTable
                employeesdata={employeesData}
                handleEdit={handleEdit}
                fetchEmployeeData={fetchEmployeeData}
                handleView={handleView}
                loading={loading}
                setIsMinimized={setIsMinimized}
                isMinimized={isMinimized}
              />
            </div>
            {/* Pagination Section */}
            <div className="flex justify-between items-center mt-2 mb-3">
              {/* Left: Total Count */}
              <div className="flex items-center gap-2 text-sm">
                <p className="flex gap-1 w-32">
                  Total Count: <span className="font-semibold">{totalCount}</span>
                </p>
              </div>

              {/* Right: Pagination */}
              <CompactPagination
                count={EmployeeResponse?.totalPages}
                page={paginationParams.currentPage}
                onPageChange={handlePageChange1}
                onEntriesChange={handleLimitChange1}
                entriesPerPage={paginationParams.pageSize}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Outlet */}
      {isMinimized && (
        <div className="w-full">
          <Outlet />
        </div>
      )}
    </div>
  )
}

export default EmployeeList