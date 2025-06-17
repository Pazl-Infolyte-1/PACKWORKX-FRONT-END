import React, { useRef } from 'react'
import { FaEye } from 'react-icons/fa'
import { Suspense } from 'react'
import ContentHeader from '../../components/New/ContentHeader'
import ProductionPlanningChart from './ProductionPlanningChart'

const ProductionPlanning = () => {
  const planningRef = useRef(null)

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

  return (
    <div ref={planningRef} className="h-full w-full bg-white">
      <ContentHeader
        heading={'Production Planning'}
        menuOptions={[
          {
            icon: <FaEye className="mr-2 text-blue-500" />,
            label: 'View Full Screen',
            onClick: handleFullScreen, // 🔔 call fullscreen here
          },
        ]}
      />
      <div className="p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductionPlanningChart />
        </Suspense>{' '}
      </div>
    </div>
  )
}

export default ProductionPlanning
