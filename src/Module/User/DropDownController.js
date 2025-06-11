import React, { useContext, useEffect, useRef, useState } from 'react'
import CategoryList from './CategoryList.js'
import CategoryOptions from './CategoryOption.js'
import EmptyState from './EmptyState.js'
import { AuthContext } from '../../Context/AuthContext.js'
import { commonApi } from '../../api/common.js'

const Setting = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isAddingOption, setIsAddingOption] = useState(false)
  const [newOptionText, setNewOptionText] = useState('')
  const [editingOption, setEditingOption] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const [refresh, setRefresh] = useState(false)
  const [categories, setCategories] = useState([])
  const { user } = useContext(AuthContext)
  const [dropdownValue, setDropDownValue] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await commonApi.getDropDown()
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [refresh])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await commonApi.getDropDownValue()
        setDropDownValue(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [refresh])

  console.log(refresh, 'categories')

  // Generate a new ID for a new option
  const generateNewId = (categoryId) => {
    const prefix = categoryId * 100
    const currentItems = categories.find((cat) => cat.id === categoryId).items
    const maxId = currentItems.reduce((max, item) => Math.max(max, item.id), prefix)
    return maxId + 1
  }

  const handleSelectCategory = (category) => {
    setSelectedCategory(category)
    setIsAddingOption(false)
    setEditingOption(null)
    setIsMobileMenuOpen(false)
  }

  const handleAddOption = async () => {
    if (newOptionText?.trim() && selectedCategory) {
      const payload = {
        client_id: user.id,
        dropdown_id: selectedCategory.id,
        dropdown_value: newOptionText.trim(),
      }

      const response = await commonApi.addDropDownValue(payload)
      if (response.status === 200 || response.status === 201) {
        setRefresh((prev) => !prev)
      }
      setNewOptionText('')
      setIsAddingOption(false)
    }
  }

  const handleEditCategory = (categoryId, newName) => {
    console.log('Edit category', categoryId, newName)

    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          name: newName,
        }
      }
      return category
    })

    setCategories(updatedCategories)

    // If we're editing the currently selected category, update it too
    if (selectedCategory && selectedCategory.id === categoryId) {
      setSelectedCategory({
        ...selectedCategory,
        name: newName,
      })
    }
  }

  const handleUpdateOption = async (item, editData) => {
    try {
      const payload = {
        id: item.id,
        client_id: user.id,
        dropdown_id: item.dropdown_id,
        dropdown_value: editData,
      }
      const response = await commonApi.updateDropDownValue(payload)
      if (response.status === 200 || response.status === 201) {
        setRefresh((prev) => !prev)
      }
    } catch (error) {
      console.error(error)
    }
    setEditingOption(null)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const handleDeleteOption = async (optionId) => {
    const response = await commonApi.deleteDropDownValue(optionId)
    if (response.status === 200 || response.status === 201) {
      setRefresh((prev) => !prev)
    }
  }

  return (
    <div className="flex h-[80vh] w-full xxxl:h-[90vh] overflow-hidden">
      <div className="flex flex-col md:flex-row w-full bg-gray-50 relative">
        {/* Mobile menu button - only visible on small screens */}
        <div className="md:hidden p-4 bg-white shadow-sm">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-between w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <span>{selectedCategory ? selectedCategory.name : 'Select Category'}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transform transition-transform ${
                isMobileMenuOpen ? 'rotate-180' : 'rotate-0'
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Dropdown list for categories on mobile */}
          {isMobileMenuOpen && (
            <div className="absolute left-4 right-4 top-[70px] bg-white shadow-lg rounded-lg overflow-hidden z-50 border border-gray-200">
              <div className="max-h-60 overflow-y-auto">
                <CategoryList
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(category) => {
                    handleSelectCategory(category)
                    setIsMobileMenuOpen(false)
                  }}
                  onEditCategory={handleEditCategory}
                  setRefresh={setRefresh}
                />
              </div>
            </div>
          )}
        </div>

        {/* Category sidebar - only visible on md screens and larger */}
        <div className="hidden md:block bg-white shadow-sm md:shadow-md md:w-64">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onEditCategory={handleEditCategory}
            setRefresh={setRefresh}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 p-4 overflow-auto">
          {selectedCategory ? (
            <CategoryOptions
              dropdownValue={dropdownValue}
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
              refresh={refresh}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  )
}

export default Setting
