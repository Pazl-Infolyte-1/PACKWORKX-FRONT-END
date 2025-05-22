const PlyToggle = ({ value, onChange, errorMessage, editTag }) => {
  const options = [2, 3, 5, 7, 9]

  const getLeftPosition = (val) => {
    const index = options.indexOf(Number(val))
    return index >= 0 ? `${index * 20}%` : '-100%'
  }

  return (
    <div className="w-[200px]">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ply
        <span className="text-red-500 ml-1">*</span>
        {/*{errorMessage && (
          <span className="text-red-500 text-sm ml-2 align-middle">{errorMessage}</span>
        )}*/}
      </label>
  <div
  className={`relative w-full h-[30px] bg-white rounded-md shadow-sm flex items-center justify-between px-1 overflow-hidden transition-colors ${
    errorMessage ? 'border-2 border-red-500' : 'border border-blue-500'
  } ${editTag ? 'opacity-50 cursor-not-allowed' : ''}`}
>

        {/* Toggle Background */}
        <div
          className="absolute top-1/2 w-[20%] h-[75%] bg-blue-500 rounded-md transform -translate-y-1/2 transition-all duration-300 z-0"
          style={{ left: getLeftPosition(value) }}
        ></div>

        {/* Options */}
        {options.map((option) => (
          <span
            key={option}
            onClick={() => !editTag && onChange(option)}
            className={`w-1/5 text-center text-sm font-medium transition-colors z-10 ${
              editTag ? 'cursor-not-allowed' : 'cursor-pointer'
            } ${Number(value) === option ? 'text-white' : 'text-gray-700'}`}
          >
            {option}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PlyToggle
