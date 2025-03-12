import { TrashIcon } from '@heroicons/react/solid'
import { useForm, useFieldArray } from 'react-hook-form'
import ActionPopup from './ActionPopup'
import { useState } from 'react'

const SkuDetails = () => {
  const [isActionDrawerOpen, setActionDrawerOpen] = useState(false)

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      skus: [
        { sku: '', quantity: '', rate: '', acceptableUnits: '' }, // Initial row
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skus',
  })

  const onSubmit = (data) => {
    console.log('Submitted Data:', data)
  }

  return (
    <div>
      <div className="mt-4 p-4 bg-white rounded-lg border border-[#c2c2c2] shadow-md w-full h-[600px]">
        {/* Title & Button Container */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Sku Details</h2>
          <button
            className="cursor-pointer w-[132px] h-[40px] px-2 border border-[#8167E5] rounded-lg bg-transparent text-[#8167E5] text-[14px] font-['Lato'] leading-[20px] outline-none"
            onClick={() => append({ sku: '', quantity: '', rate: '', acceptableUnits: '' })}
          >
            + Add Sku
          </button>
        </div>

        <div className="w-[100%] h-[200px] bg-white rounded-[10px] shadow-md shadow-[rgba(3,3,3,0.1)]">
          <div className="overflow-x-auto p-5">
            <div className="max-h-[150px] overflow-y-auto rounded-lg">
              <table className="min-w-full bg-white rounded-lg max-h-[1250px]">
                {/* Table Head */}
                <thead className="sticky top-0 bg-white z-10">
                  <tr>
                    <th className="px-4 py-2 text-left">Sku</th>
                    <th className="px-4 py-2 text-left">Quantity Required</th>
                    <th className="px-4 py-2 text-left">Rate Per Sku</th>
                    <th className="px-4 py-2 text-left">Acceptable Sku Units</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="h-[60px]">
                  {fields.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      {/* SKU Dropdown */}
                      <td className="px-4 py-2">
                        <select
                          {...register(`skus.${index}.sku`)}
                          className="w-[320px] h-[40px] px-2 border border-[#c2c2c2] rounded-md bg-white text-[#c2c2c2] outline-none"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select SKU
                          </option>
                          <option value="sterling">Sterling Labs</option>
                          <option value="client1">Client 1</option>
                          <option value="client2">Client 2</option>
                        </select>
                      </td>

                      {/* Quantity Input */}
                      <td className="px-4 py-2">
                        <input
                          {...register(`skus.${index}.quantity`)}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                        />
                      </td>

                      {/* Rate Per SKU Input */}
                      <td className="px-4 py-2">
                        <input
                          {...register(`skus.${index}.rate`)}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                        />
                      </td>

                      {/* Acceptable SKU Units Input */}
                      <td className="px-4 py-2">
                        <input
                          {...register(`skus.${index}.acceptableUnits`)}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                        />
                      </td>

                      {/* Delete Icon */}
                      <td className="px-4 py-2">
                        <button type="button" onClick={() => remove(index)}>
                          <TrashIcon className="text-[#ff2d55] w-8 h-8 cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-10">
            <table className="w-[500px] ml-[50%] mb-[1%]">
              {/*<thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Column 1</th>
            <th className="border px-4 py-2">Column 2</th>
            <th className="border px-4 py-2">Column 3</th>
          </tr>
        </thead>*/}
              <tbody>
                <tr>
                  <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                    Total Qty:2000
                  </td>
                  <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                    Total:
                  </td>
                  <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                    74000
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                    SGST:
                  </td>
                  <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                    44400
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                    CGST:
                  </td>
                  <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                    44400
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                    Total Incl of GST:
                  </td>
                  <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                    828800
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center w-full mt-10">
            {/* Left-aligned button */}
            <button onClick={() => setActionDrawerOpen(true)} className="cursor-pointer w-[190.12px] h-[45px] px-2 border border-[#8167e5] rounded-lg bg-transparent text-[#8167e5] text-[14px] font-lato leading-[20px] outline-none">
              Previous Invoice Rates
            </button>

            {/* Right-aligned buttons */}
            <div className="flex gap-4">
              <button className="cursor-pointer w-[111.12px] h-[45px] px-2 border border-[#8167e5] rounded-lg bg-transparent text-[#8167e5] text-[14px] font-lato leading-[20px] outline-none">
                Save As Draft
              </button>
              <button className="cursor-pointer w-[111.12px] h-[45px] px-2 border border-[#8167e5] rounded-lg bg-transparent text-[#8167e5] text-[14px] font-lato leading-[20px] outline-none">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <ActionPopup visible={isActionDrawerOpen} setVisible={() => setActionDrawerOpen(false)} />

    </div>
  )
}

export default SkuDetails
