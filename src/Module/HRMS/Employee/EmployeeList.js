import React, { useState, useEffect, use, useRef } from 'react'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import { TbSmartHome } from 'react-icons/tb'
import { BiSearchAlt } from 'react-icons/bi'
import axios from 'axios'
import apiMethods from '../../../api/config'


import CommonPagination from '../../../components/New/Pagination'
import EmployeeForm from './EmployeeForm'
import EmployeeTable from './EmployeeTable'
import ActionButton from '../../../components/New/ActionButton'
import SearchBar from '../../../components/New/SearchBar'
import EmployeeView from './EmployeeView'
import { useSearch } from '../../../components/New/SearchContext'
import { paginationClasses } from '@mui/material'



function EmployeeList() {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isEdit, setIsEdit] = useState(false)
  const rowsPerPage = 10
  const [employeesData, setEmployeesData] = useState([])
  const [CurrentEmployeeId , setCurrentEmployeeId] = useState(null);
  const [EmployeeResponse,setEmployeeResponse] = useState(null);
  const [showEmployeeData,setShowEmployeeData] = useState(false)
  const [viewEmployeeData,setViewEmployeeData] = useState(null);
  const { searchQuery, setSearchQuery, filteredSearchData,handleSearch } = useSearch() ///need to verify

  

  
  const searchBarRef = useRef(null)
  const [filter,setFilter]=useState('')
  
  const [paginationParams, setPaginationParams] = useState({
    currentPage: 1,
    pageSize: 10
  });

  const handlePageChange1 = (event, newPage) => {
    setPaginationParams(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  // const HandleFilter = (e)=>{
  //   // setSearchQuery(active)
  //   console.log(e.target.value)
  //   setHandleFilter(e.target.value)
  //   searchBarRef.setQuery(e.target.value)
  // }

  const HandleFilter = (e) => {
    const selectedValue = e.target.value
    setFilter(selectedValue)
  
    // Trigger search globally
    handleSearch(selectedValue, employeesData)
  }

  const handleLimitChange1 = (newLimit) => {
    setPaginationParams({
      currentPage: 1, // Always reset to page 1 when changing limit
      pageSize: newLimit
    });
    
  };
  
  
  

  // State to manage form data
  const [formData, setFormData] = useState({
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
    country_phonecode:null,
    country_id:null
  });

    const [dropdownOptions, setDropdownOptions] = useState({
      countries: [],
      companiesAddresses: [],
      departments: [],
      designations: [],
      roles: [],
      reporting_to: [
       { id: 3, name: 'Jane Smith' },
      { id: 3, name: 'Mike Johnson' },
      { id: 3, name: 'Sarah Williams' }
      ]
    });
  
    useEffect(() => {
      const fetchDropDownData = async () => {
        try {
          const [
            countriesResponse,
            companiesAddressResponse,
            departmentsResponse,
            designationsResponse,
            rolesResponse
          ] = await Promise.all([
            apiMethods.getCountries(),
            apiMethods.getCompanyAddress(),
            apiMethods.getDepartmentsList(),
            apiMethods.getDesignation(),
            apiMethods.getRoles()
          ]);
  
          setDropdownOptions({
            countries: countriesResponse?.data?.data,
            companiesAddresses: companiesAddressResponse?.data?.data,
            departments: departmentsResponse?.data?.data,
            designations: designationsResponse?.data?.data,
            roles: rolesResponse?.data?.data
          });
        } catch (error) {
          console.error('Error fetching dropdown data:', error);
        }
      };
  
      fetchDropDownData();
    }, []);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await apiMethods.GetEmployeelist()
  //       setEmployeesData(response.data.data)
  //     } catch (error) {
  //       console.error('Error fetching data:', error)
  //     }
  //   }
  //   fetchData()

  // }, [])




  const fetchEmployeeData = async () => {

    try {
      const response = await apiMethods.GetEmployeelist({
        search: searchQuery,
        page: paginationParams.currentPage,
        limit: paginationParams.pageSize,
      })
      setEmployeesData(response.data.data)
      setEmployeeResponse(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    setPaginationParams(prev => ({
      ...prev,
      currentPage: 1 // Reset to page 1 whenever search query changes
      
    })
  );
  }, [searchQuery]);
  
  // Initial data fetch on component mount
  useEffect(() => {
    fetchEmployeeData()
  }, [searchQuery,paginationParams,filter,setPaginationParams.current])


  // const handlePageChange = (event, newPage) => {
  //   // console.log(employeesData)
  //   // console.log(EmployeeResponse)
  //   setEmployeeResponse((prev) => ({ ...prev, currentPage: newPage }));
  //   console.log("called page change")
  //   console.log(EmployeeResponse)
  // };

  const handleView = async (id)=>{
    try{
      console.log("Requesting for data for employee");
      const response = await apiMethods.getEmployeeData(id);
      setViewEmployeeData(response.data.data)
      setShowEmployeeData(true)

    }catch(err){
      console.log(err);
    }
  }

  const handleEdit = async (id, userId) => {
    setIsEdit(true);
    setCurrentEmployeeId(userId);
    
    try {
        // Log the request parameters
        console.log('Requesting employee data for ID:', id);
        
        const response = await apiMethods.getEmployeeData(id);
        
        // Log the full response to see its structure
        console.log('API Response:', response);
        
        if (!response || !response.data || !response.data.data) {
            console.error('Invalid API response structure:', response);
            return;
        }
        
        const selectedEmployee = response.data.data;
        console.log('Selected Employee Data:', selectedEmployee);
        
        // Set form data and then open drawer

        setFormData({
          name: selectedEmployee.user_name || '',
          email: selectedEmployee.user_email || '',
          password: selectedEmployee.password || '',
          mobile: selectedEmployee.mobile || '',
          employee_id: selectedEmployee.employee_id || '',
          address: selectedEmployee.address || '',
          skills: selectedEmployee.skills || '',
          department_id:selectedEmployee.department_id, 
          designation_id:selectedEmployee.designation_id ,
          company_address_id:selectedEmployee.company_address_id,
          role_id: selectedEmployee.role_id||"",
          reporting_to:selectedEmployee.reporting_to,
          joining_date: selectedEmployee.joining_date || '',
          date_of_birth: selectedEmployee.date_of_birth || '',
          about_me: selectedEmployee.about_me || '',
          contract_end_date: selectedEmployee.contract_end_date || '',
          employment_type: selectedEmployee.employment_type || '',
          image: selectedEmployee.image || '',
          country_phonecode:selectedEmployee.country_phonecode||'',
          country_id:selectedEmployee.country_id||''
      });
        
        // Add a delay before opening the drawer to ensure state is updated
        setTimeout(() => {
            setDrawerOpen(true);
            console.log('Current form data after setting:', formData); // This will likely show stale data due to closure
        }, 100);
    } catch (error) {
        console.error('Error fetching employee data:', error);
    }
};

  console.log(formData,'fasfdaf')
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);


    try {
        let response;
        if (isEdit) {
          // const employee = {
          //   aboutMe: "55",
          //   address: "Mattathodi house, moolath parambil",
          //   companyAddressId: 1,
          //   contractEndDate: "2025-04-08",
          //   dateOfBirth: "2025-04-04",
          //   departmentId: 1,
          //   designationId: 2,
          //   email: "editeduser14544.s@pazl.info",
          //   employeeId: "EMP567",
          //   employmentType: "Full-time",
          //   image: "localhost",
          //   joiningDate: "2025-04-11",
          //   mobile: "8606893474",
          //   name: "Edited",
          //   password: "123123123",
          //   reportingTo: 3,
          //   roleId: 1,
          //   skills: "aa"
          // }  ;
          // console.log("edit api called")
          
            response = await apiMethods.editEmployee(CurrentEmployeeId,formData);
            console.log("edit api called")
        } else {
            response = await apiMethods.createNewEmployee(formData);
        }

        if (response?.status === 200 || response?.status === 201) {
            alert('Success!');
            setDrawerOpen(false);
            setIsEdit(false)
            fetchEmployeeData()
            setFormData({
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
            })
            fetchEmployeeData()

        } else {
            alert('Something went wrong. Please try again.');
        }

        console.log(response);
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred. Please check your input and try again.');
    }
};


  return (
    <>
      <div className="">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold"> Employee</h2>
          <div className="flex gap-2">

            <ActionButton
              label={" + Add Employee"}
              onClick={() => { setDrawerOpen(true), setIsEdit(false);
              }}
              variant='add'
              className='text-white'
            />

            <ActionButton
              label={"Import"}
            />

            <ActionButton
              label={"Export"}
            />
          </div>
        </div>

        <div className="h-10 flex items-center mt-1.5  border border-gray-300 rounded-md ">
          <div className="flex gap-8 ml-5">
            <div className="flex gap-1.5 items-center">
              <TbSmartHome className="text-teal-500" />
              <span>All Datas</span>
              <span className="bg-teal-500 text-white rounded-md h-6 w-10 flex justify-center items-center">
                {EmployeeResponse?.totalRecords}
              </span>
            </div>
            <div className="flex gap-1.5 items-center">
              <IoCheckmarkCircleOutline />
              <span>Active</span>
              <span className="bg-teal-500 text-white rounded-md h-6 w-10 flex justify-center items-center">
              {EmployeeResponse?.activeEmployees}              </span>
            </div>
            <div className="flex gap-1.5 items-center">
              <IoCheckmarkCircleOutline />
              <span>Inactive</span>
              <span className="bg-teal-500 text-white rounded-md h-6 w-10 flex justify-center items-center">
              {EmployeeResponse?.inactiveEmployees}
               </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 px-3 py-1 mt-1 rounded-md">
          <div className="max-w-[1280px] mx-auto mt-1 flex justify-between gap-2">
             <SearchBar text="Employees" data={employeesData} ref={searchBarRef} />
             <div className='flex justify-end gap-3'>
             <select
  className="bg-white border border-[#e7e5e4] p-[6px] rounded-md"
  defaultValue=""
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
              className="border border-[#e7e5e4] p-[6px] rounded-md"
              defaultValue=""
              onChange={HandleFilter}
              >
              <option value="" disabled>
                Select Role
              </option>
              {
                dropdownOptions.roles.map((role)=>(
                  <option key={role.id} value={role.name}>
                  {role.name}
                </option>
                ))
              }
           
            </select>

            {/* <select
              className="border border-[#e7e5e4] p-[6px] rounded-md"
              defaultValue=""
              onChange={HandleFilter}
              >
              <option value="" disabled>
              Reporting Manager 
              </option>
              {
                dropdownOptions.reporting_to?.map((manager)=>(
                  <option key={manager.id} value={manager.name}>
                  {manager.name}
                </option>
                ))
              }
            </select> */}

            <select
              className="border border-[#e7e5e4] p-[6px] rounded-md"
              defaultValue=""
              onChange={HandleFilter}
              >
              <option value="" disabled>
                status
              </option>
              <option value="active">Active</option>
              <option value="deactive">Inactive</option>
            </select>
              </div>
          </div>

          <div className="border h-[80%] mt-2">
            <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  p-3">
              <EmployeeTable
               employeesdata={employeesData}
               handleEdit={handleEdit}
               fetchEmployeeData={fetchEmployeeData}
               handleView={handleView}
                />
              <EmployeeView
              showEmployeeData={showEmployeeData}
              employeeData={viewEmployeeData}
              setVisible = {setViewEmployeeData}
              />
            </div>
          </div>
          {/* Pagination Section */}
          <div className="flex justify-end items-center gap-4 mt-2 mb-3">
            <CommonPagination
              count={EmployeeResponse?.totalPages}
  page={paginationParams.currentPage}
  onChange={handlePageChange1}
  onLimitChange={handleLimitChange1}
  limit={paginationParams.pageSize}

              />
          </div>
        </div>
        <div>
          <EmployeeForm isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} formData={formData} setFormData={setFormData} isEdit={isEdit} handleSubmit={handleSubmit} dropdownOptions={dropdownOptions} />
        </div>
      </div>
    </>
  )
}

export default EmployeeList
