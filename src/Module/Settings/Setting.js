import React, { useEffect, useRef, useState } from 'react';
import CategoryList from './CategoryList.js';
import CategoryOptions from './CategoryOption.js';
import EmptyState from './EmptyState.js';

const Setting = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOptionText, setNewOptionText] = useState('');
  const [editingOption, setEditingOption] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  const [categories, setCategories] = useState([
        {
          id: 1,
          name: 'Materials',
          items: [
            { id: 101, value: 'Wood' },
            { id: 102, value: 'Steel' },
            { id: 103, value: 'Plastic' },
            { id: 104, value: 'Glass' },
            { id: 105, value: 'Aluminum' }
          ]
        },
        {
          id: 2,
          name: 'Sizes',
          items: [
            { id: 201, value: 'Small' },
            { id: 202, value: 'Medium' },
            { id: 203, value: 'Large' },
            { id: 204, value: 'X-Large' },
            { id: 205, value: 'Custom' }
          ]
        },
        {
          id: 3,
          name: 'Colors',
          items: [
            { id: 301, value: 'Red' },
            { id: 302, value: 'Blue' },
            { id: 303, value: 'Green' },
            { id: 304, value: 'Yellow' },
            { id: 305, value: 'Black' },
            { id: 306, value: 'White' }
          ]
        },
        {
          id: 4,
          name: 'Finishes',
          items: [
            { id: 401, value: 'Matte' },
            { id: 402, value: 'Glossy' },
            { id: 403, value: 'Textured' },
            { id: 404, value: 'Polished' }
          ]
        },
        {
          id: 5,
          name: 'Weights',
          items: [
            { id: 501, value: 'Light' },
            { id: 502, value: 'Medium' },
            { id: 503, value: 'Heavy' }
          ]
        },
        {
          id: 6,
          name: 'Shapes',
          items: [
            { id: 601, value: 'Square' },
            { id: 602, value: 'Rectangle' },
            { id: 603, value: 'Circle' },
            { id: 604, value: 'Triangle' },
            { id: 605, value: 'Custom' }
          ]
        },
        {
          id: 7,
          name: 'Patterns',
          items: [
            { id: 701, value: 'Solid' },
            { id: 702, value: 'Striped' },
            { id: 703, value: 'Dotted' },
            { id: 704, value: 'Checkered' }
          ]
        },
        {
          id: 8,
          name: 'Textures',
          items: [
            { id: 801, value: 'Smooth' },
            { id: 802, value: 'Rough' },
            { id: 803, value: 'Bumpy' },
            { id: 804, value: 'Ridged' }
          ]
        },
        {
          id: 9,
          name: 'Styles',
          items: [
            { id: 901, value: 'Modern' },
            { id: 902, value: 'Classic' },
            { id: 903, value: 'Vintage' },
            { id: 904, value: 'Industrial' },
            { id: 905, value: 'Minimalist' }
          ]
        },
                {
          id: 10,
          name: 'Gender',
          items: [
            { id: 901, value: 'Modern' },
            { id: 902, value: 'Classic' },
            { id: 903, value: 'Vintage' },
            { id: 904, value: 'Industrial' },
            { id: 905, value: 'Minimalist' }
          ]
        },

      ]);
  // Generate a new ID for a new option
  const generateNewId = (categoryId) => {
    const prefix = categoryId * 100;
    const currentItems = categories.find(cat => cat.id === categoryId).items;
    const maxId = currentItems.reduce((max, item) => Math.max(max, item.id), prefix);
    return maxId + 1;
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setIsAddingOption(false);
    setEditingOption(null);
    setIsMobileMenuOpen(false); // Close mobile menu when category is selected
  };

  const handleAddOption = () => {
    if (newOptionText.trim() && selectedCategory) {
      const updatedCategories = categories.map(category => {
        if (category.id === selectedCategory.id) {
          return {
            ...category,
            items: [
              ...category.items,
              {
                id: generateNewId(category.id),
                value: newOptionText.trim()
              }
            ]
          };
        }
        return category;
      });
      
      setCategories(updatedCategories);
      setNewOptionText('');
      setIsAddingOption(false);
    }
  };

  const handleEditCategory = (categoryId, newName) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          name: newName
        };
      }
      return category;
    });
    
    setCategories(updatedCategories);
    
    // If we're editing the currently selected category, update it too
    if (selectedCategory && selectedCategory.id === categoryId) {
      setSelectedCategory({
        ...selectedCategory,
        name: newName
      });
    }
  };

  const handleUpdateOption = (optionId, newValue) => {
    if (newValue.trim() && selectedCategory) {
      const updatedCategories = categories.map(category => {
        if (category.id === selectedCategory.id) {
          return {
            ...category,
            items: category.items.map(item => 
              item.id === optionId ? { ...item, value: newValue.trim() } : item
            )
          };
        }
        return category;
      });
      
      setCategories(updatedCategories);
      setEditingOption(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleDeleteOption = (optionId) => {
    const updatedCategories = categories.map(category => {
      if (category.id === selectedCategory.id) {
        return {
          ...category,
          items: category.items.filter(item => item.id !== optionId)
        };
      }
      return category;
    });
    
    setCategories(updatedCategories);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[70%] w-full xxxl:h-[90vh] bg-gray-50">
      {/* Mobile menu button - only visible on small screens */}
      <div className="md:hidden p-4 bg-white shadow-sm">
      <button 
        onClick={toggleMobileMenu}
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        <span>{selectedCategory ? selectedCategory.name : 'Select Category'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
    
    {/* Category sidebar - always visible on md screens, conditionally visible on small screens */}
    <div className={`
      ${isMobileMenuOpen ? 'block' : 'hidden'} 
      md:block
      w-[87%] md:w-64 
      bg-white
      shadow-sm md:shadow-md
      absolute md:relative
      z-10 md:z-0
      top-30 md:top-0
      max-h-96 md:max-h-full
      overflow-y-auto
    `}>
      <CategoryList 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onEditCategory={handleEditCategory}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
    </div>
      
      {/* Main content area */}
      <div className="flex-1 p-4 overflow-auto">
        {selectedCategory ? (
          <CategoryOptions 
            category={selectedCategory}
            isAddingOption={isAddingOption}
            newOptionText={newOptionText}
            editingOption={editingOption}
            onAddOption={handleAddOption}
            onUpdateOption={handleUpdateOption}
            onDeleteOption={handleDeleteOption}
            onSetAddingOption={setIsAddingOption}
            onSetNewOptionText={setNewOptionText}
            onSetEditingOption={setEditingOption}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Setting;