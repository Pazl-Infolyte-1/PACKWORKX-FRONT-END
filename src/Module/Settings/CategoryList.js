import React, { useState, useRef, useEffect } from 'react';

const CategoryList = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onEditCategory, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}) => {
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const menuRef = useRef(null);
  const editInputRef = useRef(null);

  const handleEditStart = (category, e) => {
    e.stopPropagation(); // Prevent category selection when clicking edit
    setEditingCategoryId(category.id);
    setEditedCategoryName(category.name);
    
    // Scroll the edited item into view after a short delay to ensure the DOM has updated
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleEditSave = (categoryId, e) => {
    e.stopPropagation(); // Prevent category selection when clicking save
    if (editedCategoryName.trim()) {
      onEditCategory(categoryId, editedCategoryName.trim());
      setEditingCategoryId(null);
    }
  };

  const handleEditCancel = (e) => {
    e.stopPropagation(); // Prevent category selection when canceling
    setEditingCategoryId(null);
  };

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // Only close if we're on mobile (menu is open) and click is outside
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  // Handle keyboard shortcuts for edit mode
  useEffect(() => {
    function handleKeyDown(event) {
      if (editingCategoryId !== null) {
        if (event.key === 'Enter') {
          handleEditSave(editingCategoryId, event);
        } else if (event.key === 'Escape') {
          handleEditCancel(event);
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingCategoryId, editedCategoryName]);

  return (
    <div 
      ref={menuRef}
      className="w-full md:w-64 bg-white h-[80vh] border-r border-gray-200 flex flex-col"
    >
      {/* Header - simplified on mobile */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">Settings</h1>
        <p className="hidden md:block text-xs text-gray-500">Manage dropdown options</p>
      </div>

      {/* Category list - list layout for both mobile and desktop */}
      <div className="overflow-y-auto overflow-x-hidden flex-grow">
        {categories.length === 0 ? (
          <div className="p-4 text-gray-500 text-sm">No available menu</div>
        ) : (
          <div className="py-2">
            {categories.map(category => (
              <div
                key={category.id}
                className={`w-full text-left px-4 py-2.5 transition-all duration-150 ${
                  selectedCategory?.id === category.id 
                    ? 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500 md:border-l-2' 
                    : 'border-l-2 border-transparent hover:bg-gray-50 text-gray-600'
                }`}
              >
                {editingCategoryId === category.id ? (
                  // Edit mode - improved layout
                  <div 
                    className="flex flex-col space-y-2" 
                    onClick={(e) => e.stopPropagation()}
                    ref={editInputRef}
                  >
                    <input
                      type="text"
                      value={editedCategoryName}
                      onChange={(e) => setEditedCategoryName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={(e) => handleEditSave(category.id, e)}
                        className="px-2 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded text-xs font-medium flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button 
                        onClick={handleEditCancel}
                        className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display mode
                  <div 
                    className="flex justify-between items-center"
                    onClick={() => onSelectCategory(category)}
                  >
                    <div className="flex items-center flex-1">
                      <span className="font-medium text-sm truncate">{category.name}</span>
                    </div>
                    <button
                      className="ml-2 p-1 text-gray-400 hover:text-gray-700 rounded transition-colors"
                      onClick={(e) => handleEditStart(category, e)}
                      aria-label="Edit category"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;