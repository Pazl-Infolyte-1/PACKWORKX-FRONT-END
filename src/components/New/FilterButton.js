import React from 'react'
import { cilFilter } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const FilterButton = () => {
  return (
    <div>
      <button className="bg-[#8761e5] h-10 rounded-md flex items-center justify-center text-white w-20 gap-1">
        <CIcon icon={cilFilter} /> Filter
      </button>
    </div>
  )
}

export default FilterButton
