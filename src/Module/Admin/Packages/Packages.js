import React, { useState, useEffect, useRef } from 'react'
import PackagesForm from './PackagesForm'
import CommonPagination from '../../../components/New/Pagination'
import PackagesTable from './PackagesTable'
import ActionButton from '../../../components/New/ActionButton'
import SearchBar from '../../../components/New/SearchBar'
import apiMethods from '../../../api/config'
import { useSearch } from '../../../components/New/SearchContext'

function Packages() {
  const [data, setData] = useState([])
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [limit, setLimit] = useState(10)
  const { searchQuery, setSearchQuery, filteredSearchData } = useSearch()
  const searchBarRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const defaultFormData = {
    name: '',
    description: '',
    max_employees: '',
    max_storage_size: '',
    storage_unit: 'MB',
    sort: '5',
    is_private: false,
    is_recommended: false,
    currency_id: '',
    monthly_status: false,
    annual_status: false,
    is_free: false,
    packageType: 'Paid plan',
    module_in_package: [],
  }

  const [formData, setFormData] = useState(defaultFormData)

  const fetchData = async (pageNumber, limit) => {
    setLoading(true)
    try {
      const response = await apiMethods.getPackages({
        page: pageNumber || pagination.page,
        limit: limit,
        search: searchQuery,
      })
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total,
      })
      setData(response.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(1)
  }, [searchQuery])

  const handleAddPackage = () => {
    setIsEdit(false)
    setFormData(defaultFormData)
    setDrawerOpen(true)
  }

  const handleEditPackage = (packageItem) => {
    setIsEdit(true)

    const editFormData = {
      name: packageItem.name,
      description: packageItem.description,
      max_employees: packageItem.max_employees,
      max_storage_size: packageItem.max_storage_size,
      storage_unit: packageItem.storage_unit,
      sort: packageItem.sort || '5',
      is_private: packageItem.is_private === 1,
      is_recommended: packageItem.is_recommended === 1,
      currency_id: packageItem.currency_id,
      monthly_status: packageItem.monthly_status == 1,
      annual_status: packageItem.annual_status == 1,
      is_free: packageItem.is_free === 1,
      packageType: packageItem.is_free === 1 ? 'Free Plan' : 'Paid plan',
      module_in_package: packageItem.module_in_package || [],
    }

    setFormData(editFormData)
    setSelectedPackage(packageItem)
    setDrawerOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        max_employees: formData.max_employees,
        max_storage_size: formData.max_storage_size,
        storage_unit: formData.storage_unit,
        sort: formData.sort,
        is_private: formData.is_private ? 1 : 0,
        is_recommended: formData.is_recommended ? 1 : 0,
        currency_id: formData.currency_id,
        monthly_status: formData.monthly_status ? 1 : 0,
        annual_status: formData.annual_status ? 1 : 0,
        is_free: formData.is_free ? 1 : 0,
        module_in_package: formData.module_in_package,
      }

      if (isEdit && selectedPackage) {
        await apiMethods.UpdatePacakges(selectedPackage.id, payload)
      } else {
        await apiMethods.AddPacakges(payload)
      }

      fetchData()
      setDrawerOpen(false)
      setFormData(defaultFormData)
      setIsEdit(false)
      setSelectedPackage(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setFormData(defaultFormData)
    setIsEdit(false)
    setSelectedPackage(null)
  }

  return (
    <div>
      <div className="w-full h-[40px]">
        <div className="flex justify-between items-center">
          <h4>Packages</h4>
        </div>
      </div>
      {/* Search Bar & Add Button */}
      <div className=" overflow-x-auto border border-gray-200 p-3 rounded-md ">
        <div className="flex justify-between items-center">
          <SearchBar text="Packages" data={data} ref={searchBarRef} />
          <div className="flex justify-center items-center gap-2">
            <ActionButton label="Add Package" onClick={handleAddPackage} variant="add" />
          </div>
        </div>

        {/* Pagination Section */}

        <div className=" h-[80%] ">
          <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  mt-3">
            <PackagesTable packagedata={data} onEdit={handleEditPackage} setData={setData} loading={loading} />
          </div>
        </div>
        {/* Pagination Section */}
        <div className="flex justify-end items-center gap-4 mt-3">
          <CommonPagination
            count={pagination?.totalPages}
            page={parseInt(pagination?.page)}
            onChange={(event, value) => {
              fetchData(value, limit)
              setPagination((prev) => ({
                ...prev,
                page: value,
              }))
            }}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              setPagination((prev) => ({
                ...prev,
                page: 1,
              }))
              fetchData(1, newLimit)
            }}
            limit={limit}
          />
        </div>
      </div>
      <div>
        <PackagesForm
          isDrawerOpen={isDrawerOpen}
          setDrawerOpen={handleCloseDrawer}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          isEdit={isEdit}
        />
      </div>
    </div>
  )
}

export default Packages
