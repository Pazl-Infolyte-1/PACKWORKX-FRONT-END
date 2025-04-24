// SelectionCards.jsx or SelectionCards.tsx (if using TypeScript)
import React from 'react'

const SelectionCards = ({
  selectionFrame,
  selected,
  onSelect
}) => {
  return (
    <div className="flex justify-center items-center space-x-12 p-6">
      {Object.keys(selectionFrame).map((key) => (
        <div
          key={key}
          className={`w-1/3 flex flex-col items-center border-4 p-2 cursor-pointer focus:outline-none ${
            selected === key ? 'border-blue-200' : 'border-gray-100'
          }`}
          onClick={() => onSelect(key)} // Mouse Click
          onKeyDown={(event) => {
            if (event.key === 'Enter') onSelect(key) // Keyboard
          }}
          tabIndex={0}
          role="button"
        >
          <img
            src={selectionFrame[key].image}
            alt={selectionFrame[key].name}
            className="w-16 h-16 rounded-full"
          />
          <p className="mt-2 text-sm font-semibold">{selectionFrame[key].name}</p>
        </div>
      ))}
    </div>
  )
}

export default SelectionCards
