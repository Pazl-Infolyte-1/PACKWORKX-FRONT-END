import { useState } from 'react';
import PopUp from '../../components/New/PopUp';

export default function VersionChoicePopup({
  isOpen,
  setIsOpen,
  handleAddVersion,
  handleAddOption,
  skuversionLimit,
  currentVersionCount
}) {
    const [selectedOption, setSelectedOption] = useState(null);
    const isVersionLimitReached = skuversionLimit && currentVersionCount >= skuversionLimit;

    const handleOptionClick = (option) => {
      setSelectedOption(option);
      console.log(`Selected: ${option}`);
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
        <div className="flex items-center justify-center w-full">
          <div className="bg-white rounded-lg flex-1 relative">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800">Choose an option</h3>
              <p className="text-sm text-gray-500">Select how you want to add this item</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Version Option or Limit Reached UI */}
              {isVersionLimitReached ? (
                <div className="flex cursor-not-allowed hover:bg-red-100 flex-col items-center justify-center p-4 rounded-lg bg-gray-50  transition-all transform">
                  <div className="mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <span className="font-medium text-lg text-gray-800">
                    Version Limit Reached
                  </span>
                  <span className="text-xs mt-1 text-gray-500">
                    Max {skuversionLimit} versions allowed
                  </span>
                  {/* <button 
                    
                    className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Manage Versions
                  </button> */}
                </div>
              ) : (
                <button 
                  onClick={handleAddVersion}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all transform ${
                    selectedOption === 'version' 
                    ? 'bg-indigo-600 text-white shadow-md scale-105' 
                    : 'bg-gray-50 hover:bg-indigo-50 hover:shadow-md'
                  }`}
                >
                  <div className="mb-3">
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
              )}
              
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