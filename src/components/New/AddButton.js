import React from 'react'

const AddButton = ({ text }) => {
  return (
    <div>
      <button className="bg-[#8761e5] h-10 rounded-md flex items-center justify-center text-white w-40 text-gap-4">
        Add {text}
      </button>
    </div>
  )
}

export default AddButton
