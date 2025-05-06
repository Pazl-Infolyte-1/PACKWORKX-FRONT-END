import { useEffect } from "react";
import ActionButton from "./ActionButton";

const MODAL_VARIANTS = {
  unsavedChanges: {
    title: "Unsaved Changes",
    message: "Are you sure you want to leave? This may cause loss of unsaved data.",
    confirmText: "Leave Anyway",
    cancelText: "Continue Editing",
    confirmVariant: "delete",
    cancelVariant: "cancel"
  },
  deleteConfirmation: {
    title: "Confirm Deletion",
    message: "Are you sure you want to delete this item?",
    confirmText: "Delete",
    cancelText: "Cancel",
    confirmVariant: "delete",
    cancelVariant: "cancel"
  },
  default: {
    title: "Are you sure?",
    message: "Do you want to proceed with this action?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmVariant: "delete",
    cancelVariant: "cancel"
  }
};

const ConfirmationModale = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  variant = "default",
  title,
  message,
  confirmText,
  cancelText,
  confirmVariant,
  cancelVariant
}) => {
  // Get default values from variant
  const variantConfig = MODAL_VARIANTS[variant] || MODAL_VARIANTS.default;
  
  // Merge props with variant defaults (props take precedence)
  const {
    title: variantTitle,
    message: variantMessage,
    confirmText: variantConfirmText,
    cancelText: variantCancelText,
    confirmVariant: variantConfirmVariant,
    cancelVariant: variantCancelVariant
  } = variantConfig;

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen) return null; 
  
  return ( 
    <div 
      className="fixed inset-0 flex items-center justify-center z-[1001] p-4 overflow-y-auto" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    > 
      <div 
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full border border-gray-200 transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title || variantTitle}</h2> 
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2"></div>
        
        <p className="mb-6 text-gray-600">{message || variantMessage}</p>
        
        <div className="flex justify-end space-x-4"> 
          <ActionButton 
            onClick={onClose} 
            label={cancelText || variantCancelText}
            variant={cancelVariant || variantCancelVariant}
            className="hover:transition-transform active:scale-95"
          /> 
          <ActionButton 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            label={confirmText || variantConfirmText}
            variant={confirmVariant || variantConfirmVariant}
            className="hover: transition-transform"
          /> 
        </div>
      </div> 
    </div> 
  ); 
}; 

export default ConfirmationModale;