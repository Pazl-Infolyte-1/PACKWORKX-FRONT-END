import ActionButton from "../../components/New/ActionButton"; 

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => { 
  if (!isOpen) return null; 
  
  return ( 
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"> 
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full border border-gray-200 transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title || 'Are you sure?'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            {/* Simple X icon using HTML/CSS */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2"></div>
        
        <p className="mb-6 text-gray-600">{message || 'Do you want to proceed with this action?'}</p>
        
        <div className="flex justify-end space-x-4"> 
          <ActionButton 
            onClick={onClose} 
            label={cancelText}
            variant="cancel"
          /> 
          <ActionButton 
            onClick={onConfirm} 
            label={confirmText} 
            variant="delete"
          /> 
        </div>
      </div> 
    </div> 
  ); 
}; 

export default ConfirmationModal;