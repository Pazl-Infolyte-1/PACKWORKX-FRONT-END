import { useEffect, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import ActionButton from "../../components/New/ActionButton";
import { IoTrash } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const AddressForm = ({ fields, remove, expandedIndices, toggleExpand }) => {
  //console.log("addressadd",addressAdded)
  const { control, register } = useFormContext();
  //const { fields, append, remove } = useFieldArray({
  //  control,
  //  name: "addresses",
  //});

  //const [expandedIndices, setExpandedIndices] = useState({}); // Track expanded state for each card

  //const addShippingAddress = () => {
  //  append(
  //    {
  //    type: "Shipping",
  //    attention: "",
  //    country: "",
  //    street1: "",
  //    street2: "",
  //    city: "",
  //    state: "",
  //    pinCode: "",
  //    phone: "",
  //    //faxNumber: "",
  //  }
  //);

  //  // Expand the newly added card by default
  //  setExpandedIndices((prev) => ({ ...prev, [fields.length]: false }));
  //};

  //const toggleExpand = (index) => {
  //  setExpandedIndices((prev) => ({ ...prev, [index]: !prev[index] }));
  //};
  //useEffect(() => {
  //  if (addressAdded) {
  //    addShippingAddress();
  //  }
  //}, [addressAdded]);
  return (
    <div className="ml-5 w-full mt-4">
      <div className="grid grid-cols-2 gap-6 bg-white rounded-lg w-full">
        {fields.map((address, index) => {
          const isExpanded = index <= 1 || expandedIndices[index]; // First two always expanded

          return (
            <div
              key={address.id}
              className={`bg-white shadow-lg rounded-2xl transition-all duration-300 ${
                isExpanded ? "p-3" : "p-2 h-12 flex items-center"
              }`}
            >
              {/* Header with title and actions */}
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-gray-700">
                  {address.type} Address
                </h3>
                <div className="flex items-center space-x-2">
                  {/* Toggle Expand Button (Only for added cards, index > 1) */}
                  {index > 1 && (
                    <button
                      onClick={() => toggleExpand(index)}
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                      aria-label="Toggle Expand"
                    >
                      {isExpanded ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                    </button>
                  )}
                  {/* Remove Button (Only for added addresses) */}
                  {index > 1 && (
                    <button
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                      aria-label="Remove Address"
                    >
                      <IoTrash size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Form Fields - Show only when expanded */}
              {isExpanded && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {/* Name Field */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600">
                      Name<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      {...register(`addresses.${index}.attention`)}
                      className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>

                  {/* Country Select */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600">
                      Country/Region<span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      {...register(`addresses.${index}.country`)}
                      defaultValue="IN"
                      className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
                    >
                      <option value="">Select</option>
                      <option value="India">India</option>
                      <option value="US">United States</option>
                    </select>
                  </div>

                  {/* Street 1 */}
                  <div className="flex flex-col col-span-2">
                    <label className="text-sm font-medium text-gray-600">Street 1</label>
                    <input
                      type="text"
                      {...register(`addresses.${index}.street1`)}
                      className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>

                  {/* Street 2 */}
                  <div className="flex flex-col col-span-2">
                    <label className="text-sm font-medium text-gray-600">Street 2</label>
                    <input
                      type="text"
                      {...register(`addresses.${index}.street2`)}
                      className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>

                  {/* City */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600">
                      City<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      {...register(`addresses.${index}.city`)}
                      className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>

                  {/* State Select */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600">
                      State<span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      defaultValue="tn"
                      {...register(`addresses.${index}.state`)}
                      className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
                    >
                      <option value="">Select State</option>
                      <option value="Tamilnadu">Tamilnadu</option>
                      <option value="Andra">Andra</option>
                    </select>
                  </div>

                  {/* Pin Code */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600">
                      Pin Code<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      {...register(`addresses.${index}.pinCode`)}
                      className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600">
                      Phone<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      {...register(`addresses.${index}.phone`)}
                      className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddressForm;
