
import { useState } from 'react';
import PopUp from '../../components/New/PopUp';



export default function VersionChoicePopup({isOpen,setIsOpen,handleAddVersion,handleAddOption}) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    // In a real implementation, you might do something with this selection
    console.log(`Selected: ${option}`);
    
    // Close popup after a brief delay to show the selection
    setTimeout(() => setIsOpen(false), 500);
  };


  return (
    <PopUp
    visible={isOpen}
    setVisible={setIsOpen}
    width={"40%"}
    height={"350px"}
    showCloseButton={true}
    >

    
    <div className="flex items-center  justify-center w-full ">
      <div className="bg-white rounded-lg  flex-1   relative ">

              {/* Close button */}
              {/* <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button> */}
        
        {/* Header */}
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800">Choose an option</h3>
          <p className="text-sm text-gray-500">Select how you want to add this item</p>
        </div>
        
        {/* Selection Grid */}
        <div className="grid grid-cols-2 gap-4 ">
          {/* Version Option */}
          <button 
            onClick={handleAddVersion}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all transform ${
                selectedOption === 'version' 
                ? 'bg-indigo-600 text-white shadow-md scale-105' 
                : 'bg-gray-50 hover:bg-indigo-50 hover:shadow-md'
            }`}
            >
            <div className="mb-3">
              {/* Version icon - Stack of documents with a version tag */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 64 64" fill="none">
                <rect x="12" y="8" width="32" height="40" rx="2" 
                  className={selectedOption === 'version' ? 'fill-white' : 'fill-indigo-100'} 
                  stroke={selectedOption === 'version' ? 'white' : 'indigo'} 
                  strokeWidth="2" />
                <rect x="20" y="16" width="32" height="40" rx="2" 
                  className={selectedOption === 'version' ? 'fill-indigo-300' : 'fill-white'} 
                  stroke={selectedOption === 'version' ? 'white' : 'indigo'} 
                  strokeWidth="2" />
                <circle cx="36" cy="28" r="8" 
                  className={selectedOption === 'version' ? 'fill-white' : 'fill-indigo-500'} />
                <text x="33" y="32" 
                  className={selectedOption === 'version' ? 'fill-indigo-500' : 'fill-white'} 
                  fontSize="12" fontWeight="bold">V</text>
              </svg>
            </div>
            <span className={`font-medium text-lg ${selectedOption === 'version' ? 'text-white' : 'text-gray-800'}`}>
              Add as Version
            </span>
            <span className={`text-xs mt-1 ${selectedOption === 'version' ? 'text-indigo-200' : 'text-gray-500'}`}>
              Update existing item
            </span>
          </button>
          
          {/* Option Option */}
          <button 
            onClick={handleAddOption}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all transform ${
              selectedOption === 'option' 
              ? 'bg-indigo-600 text-white shadow-md scale-105' 
              : 'bg-gray-50 hover:bg-indigo-50 hover:shadow-md'
            }`}
            >
            <div className="mb-3">
              {/* Option icon - Branching structure */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="16" r="8" 
                  className={selectedOption === 'option' ? 'fill-white' : 'fill-indigo-500'} />
                <line x1="32" y1="24" x2="32" y2="32" 
                  stroke={selectedOption === 'option' ? 'white' : 'indigo'} 
                  strokeWidth="2" />
                <line x1="32" y1="32" x2="16" y2="48" 
                  stroke={selectedOption === 'option' ? 'white' : 'indigo'} 
                  strokeWidth="2" />
                <line x1="32" y1="32" x2="48" y2="48" 
                  stroke={selectedOption === 'option' ? 'white' : 'indigo'} 
                  strokeWidth="2" />
                <circle cx="16" cy="48" r="6" 
                  className={selectedOption === 'option' ? 'fill-white' : 'fill-indigo-300'} />
                <circle cx="48" cy="48" r="6" 
                  className={selectedOption === 'option' ? 'fill-white' : 'fill-indigo-300'} />
                <text x="12" y="51" 
                  className={selectedOption === 'option' ? 'fill-indigo-500' : 'fill-white'} 
                  fontSize="8" fontWeight="bold">1</text>
                <text x="44" y="51" 
                  className={selectedOption === 'option' ? 'fill-indigo-500' : 'fill-white'} 
                  fontSize="8" fontWeight="bold">2</text>
              </svg>
            </div>
            <span className={`font-medium text-lg ${selectedOption === 'option' ? 'text-white' : 'text-gray-800'}`}>
              Add as Option
            </span>
            <span className={`text-xs mt-1 ${selectedOption === 'option' ? 'text-indigo-200' : 'text-gray-500'}`}>
              Create alternative choice
            </span>
          </button>
        </div>
      </div>
    </div>
                  </PopUp>
  );
}