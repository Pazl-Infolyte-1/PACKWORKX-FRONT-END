import React, { useState, useEffect, use } from 'react'
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



function EmployeeList() {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isEdit, setIsEdit] = useState(false)
  const rowsPerPage = 10
  const [employeesData, setEmployeesData] = useState([])
  const [CurrentEmployeeId , setCurrentEmployeeId] = useState(null);

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
  });

    const [dropdownOptions, setDropdownOptions] = useState({
      countries: [],
      companiesAddresses: [],
      departments: [],
      designations: [],
      roles: []
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
      const response = await apiMethods.GetEmployeelist()
      setEmployeesData(response.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  
  // Initial data fetch on component mount
  useEffect(() => {
    fetchEmployeeData()
  }, [])


  const tableData = Array.isArray(formData) ? formData : []

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(tableData.length / rowsPerPage)

  const handleEdit = async (id) => {
    setIsEdit(true);
    setCurrentEmployeeId(id)
    const selectedData = await apiMethods.getEmployeeData(id)
    const selectedEmployee = selectedData.data.data;
    

    console.log(selectedEmployee, 'Selected Employee Data');


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
        role_id: selectedEmployee.role_id,
        reporting_to:selectedEmployee.reporting_to,
        joining_date: selectedEmployee.joining_date || '',
        date_of_birth: selectedEmployee.date_of_birth || '',
        about_me: selectedEmployee.about_me || '',
        contract_end_date: selectedEmployee.contract_end_date || '',
        employment_type: selectedEmployee.employment_type || '',
        image: selectedEmployee.image || '',
    });

    setDrawerOpen(true);
};

  console.log(formData,'fasfdaf')
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);


    try {
        let response;
        if (isEdit) {
            response = await apiMethods.editEmployee(CurrentEmployeeId,formData);
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
          <h2 className="text-2xl font-bold">Employee</h2>
          <div className="flex gap-2">
            {/* <button
              className="bg-teal-500 text-white px-2.5 py-1 rounded-md border-none hover:bg-teal-600 "
              onClick={() => {
                setDrawerOpen(true)
              }}
            >
              + Create Employee
            </button> */}

            <ActionButton
              label={" + Create Employee"}
              onClick={() => { setDrawerOpen(true), setIsEdit(false);
              }}
              customColor='bg-teal-500'
              className='text-white hover:hover:bg-teal-600'
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
                5055
              </span>
            </div>
            <div className="flex gap-1.5 items-center">
              <IoCheckmarkCircleOutline />
              <span>Active</span>
              <span className="bg-teal-500 text-white rounded-md h-6 w-10 flex justify-center items-center">
                500
              </span>
            </div>
            <div className="flex gap-1.5 items-center">
              <IoCheckmarkCircleOutline />
              <span>Inactive</span>
              <span className="bg-teal-500 text-white rounded-md h-6 w-10 flex justify-center items-center">
                50
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 px-3 py-1 mt-1 rounded-md">
          <div className="max-w-[1280px] mx-auto mt-1 flex justify-evenly gap-2 items-center">
            <SearchBar text={'Employee'} data={tableData} />

            <select
              className="bg-white border border-[#e7e5e4] p-[6px] rounded-md "
              defaultValue=""
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="">Department1</option>
              <option value="">Department2</option>
              <option value="">Department3</option>
            </select>

            <select
              className="border border-[#e7e5e4] p-[6px] rounded-md"
              defaultValue=""
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="">Role1</option>
              <option value="">Role2</option>
              <option value="">Role3</option>
            </select>

            <select
              className="border border-[#e7e5e4] p-[6px] rounded-md"
              defaultValue=""
            >
              <option value="" disabled>
                Select Manager
              </option>
              <option value="">Manager1</option>
              <option value="">Manager2</option>
              <option value="">Manager3</option>
            </select>
          </div>

          <div className="border h-[80%] mt-2">
            <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  p-3">
              <EmployeeTable employeesdata={employeesData}  handleEdit={handleEdit} fetchEmployeeData={fetchEmployeeData} />
            </div>
          </div>
          {/* Pagination Section */}
          <div className="flex justify-end items-center gap-4 mt-2 mb-3">
            <CommonPagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
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
