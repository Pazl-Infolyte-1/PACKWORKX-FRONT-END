import React, { useEffect, useRef, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { Suspense } from 'react'
import ContentHeader from '../../components/New/ContentHeader'
import ProductionPlanningChart from './ProductionPlanningChart'
import { productionApi } from '../../api/production'
import { machineApi } from '../../api/machine'
import { employeeApi } from '../../api/employee'
import CustomAlert from '../../components/New/CustomAlert'

const ProductionPlanning = () => {
  const planningRef = useRef(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [employeesData, setEmployeesData] = useState([])
  const [machinesData, setMachinesData] = useState([])
  const [groupsData, setGroupsData] = useState([])
  const [alerts, setAlerts] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('')
  const GroupFilterOptions = [
    {
      id: 0,
      label: 'In Progress',
      value: 'in_progress',
    },
    {
      id: 1,
      label: 'Completed',
      value: 'completed',
    },
  ]

  const handleFullScreen = () => {
    if (planningRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        enterFullScreen(planningRef.current)
      }
    }
  }

  const enterFullScreen = (element) => {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  }

  useEffect(() => {
    const handleChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    const fetchData = async () => {
      const employeeData = await employeeApi.getEmployeeList({})
      setEmployeesData(employeeData?.data?.data)
      const machines = await machineApi.getMachine({})
      setMachinesData(machines?.data?.data)
      const groups = await productionApi.getProductionPlanningGroups({})
      const productionGroups = groups?.data?.data.filter(
        (group) => group.group_status === 'allocation_completed',
      )
      setGroupsData(groups?.data?.data)
    }
    fetchData()

    document.addEventListener('fullscreenchange', handleChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleChange)
    }
  }, [])

  const handleClose = () => {
    setAlerts([])
  }

  return (
    <div ref={planningRef} className="bg-white h-[calc(100vh-64px)] flex flex-col">
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <ContentHeader
        heading={'Production Planning'}
        isAddNew={false}
        filterButton={true}
        filterButtonClick={(e) => {
          const selected = e.target.value
          setSelectedFilter(selected)
        }}
        filterOptions={GroupFilterOptions}
        menuOptions={[
          {
            icon: <FaEye className="mr-2 text-blue-500" />,
            label: 'View Full Screen',
            onClick: handleFullScreen,
          },
        ]}
      />

      <div
        className={`mt-2 p-2 ${
          isFullScreen ? 'w-screen' : ''
        } max-w-full flex-grow overflow-hidden`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <ProductionPlanningChart
            employeesData={employeesData}
            machinesData={machinesData}
            groupsData={groupsData}
            setAlerts={setAlerts}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductionPlanning
