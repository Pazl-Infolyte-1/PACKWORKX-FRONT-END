import { TrashIcon } from '@heroicons/react/solid'
import { useForm, useFieldArray } from 'react-hook-form'
import ActionPopup from './ActionPopup'
import { useEffect, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'

const SkuDetails = ({formData, setFormData, skuDetailsForm}) => {
  const [isActionDrawerOpen, setActionDrawerOpen] = useState(false)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalSGST, setTotalSGST] = useState(0)
  const [totalCGST, setTotalCGST] = useState(0)
  const [totalWithGST, setTotalWithGST] = useState(0)

  // Initialize form with skuDetailsForm data if it exists
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      skus: skuDetailsForm && skuDetailsForm.length > 0 
        ? skuDetailsForm.map(item => ({
            sku: item.sku || '',
            quantity: item.quantity_required || '',
            rate: item.rate_per_sku || '',
            acceptableUnits: item.acceptable_sku_units || '',
            totalAmount: item.total_amount || '',
            sgst: item.sgst || '',
            cgst: item.cgst || '',
            total: item.total_incl__gst || ''
          }))
        : [{ sku: '', quantity: '', rate: '', acceptableUnits: '', totalAmount: '', sgst: '', cgst: '', total: '' }]
    }
  })

  // Update form when skuDetailsForm changes
  useEffect(() => {
    if (skuDetailsForm && skuDetailsForm.length > 0) {
      const formattedData = skuDetailsForm.map(item => ({
        sku: item.sku || '',
        quantity: item.quantity_required || '',
        rate: item.rate_per_sku || '',
        acceptableUnits: item.acceptable_sku_units || '',
        totalAmount: item.total_amount || '',
        sgst: item.sgst || '',
        cgst: item.cgst || '',
        total: item.total_incl__gst || ''
      }))
      
      reset({ skus: formattedData })
      
      // Calculate totals
      const qty = formattedData.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0)
      const amount = formattedData.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0)
      const sgst = formattedData.reduce((sum, item) => sum + (parseFloat(item.sgst_amount) || 0), 0)
      const cgst = formattedData.reduce((sum, item) => sum + (parseFloat(item.cgst_amount) || 0), 0)
      const withGST = formattedData.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)
      
      setTotalQuantity(qty)
      setTotalAmount(amount)
      setTotalSGST(sgst)
      setTotalCGST(cgst)
      setTotalWithGST(withGST)
    }
  }, [skuDetailsForm, reset])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skus',
  })

  const onSubmit = (data) => {
    console.log('Submitted Data:', data)
    // Here you would process the form data and update the parent component
    if (setFormData) {
      setFormData(prevData => ({
        ...prevData,
        skuDetails: data.skus
      }))
    }
  }

  return (
    <div>
      <div className="mt-2 p-4 bg-white rounded-lg border border-[#c2c2c2] w-full max-h-[600px]">
        {/* Title & Button Container */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Sku Details</h2>
          <ActionButton
            onClick={() => append({ sku: '', quantity: '', rate: '', acceptableUnits: '', totalAmount: '', sgst: '', cgst: '', total: '' })}
            variant='add'
            label={"+ Add Sku"}
          />
        </div>

        <div className="w-[100%] max-h-[250px] mt-4 rounded-[10px] border border-[#c2c2c2]">
          <div className="overflow-x-auto p-2">
            <div className="max-h-[200px] overflow-y-auto custom-scrollbar rounded-lg">
              <table className="min-w-full bg-white rounded-lg max-h-[1250px] border-collapse">
                {/* Table Head */}
                <thead className="sticky top-0 bg-white z-10">
                  <tr className='border-b-2'>
                    <th className="px-4 py-2 text-left">Sku</th>
                    <th className="px-4 py-2 text-left">Quantity Required</th>
                    <th className="px-4 py-2 text-left">Rate Per Sku</th>
                    <th className="px-4 py-2 text-left">Acceptable Sku Units</th>
                    <th className="px-4 py-2 text-left">Total Amount</th>
                    <th className="px-4 py-2 text-left">SGST</th>
                    <th className="px-4 py-2 text-left">CGST</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="h-[60px]">
                  {fields.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 border-t">
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

                      {/* Total Amount */}
                      <td className="px-4 py-2">
                        <input
                          {...register(`skus.${index}.totalAmount`)}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                        />
                      </td>

                      {/* SGST */}
                      <td className="px-4 py-2">
                        <input
                          {...register(`skus.${index}.sgst`)}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                        />
                      </td>

                      {/* CGST */}
                      <td className="px-4 py-2">
                        <input
                          {...register(`skus.${index}.cgst`)}
                          type="number"
                          placeholder="0"
                          className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-white text-[#030303] outline-none"
                        />
                      </td>

                      {/* Total */}
                      <td className="px-4 py-2">
                        <input
                          {...register(`skus.${index}.total`)}
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
        </div>
        <div className="flex flex-row-reverse mt-4">
          <table className="">
            <tbody className='gap-4'>
              <tr>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Total Qty: {totalQuantity}
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Total:
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  {totalAmount.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  SGST:
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  {totalSGST.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  CGST:
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  {totalCGST.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  Total Incl of GST:
                </td>
                <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                  {totalWithGST.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center w-full mt-10">
          <ActionButton
            onClick={() => setActionDrawerOpen(true)}
            label={"Previous Invoice Rates"}
            variant='minimal'
          />

          <div className="flex gap-4">
            <ActionButton
              label={"Save As Draft"}
              variant='minimal'
            />

            <ActionButton
              onClick={handleSubmit(onSubmit)}
              label={"Submit"}
              variant='minimal'
            />
          </div>
        </div>
      </div>
      <ActionPopup visible={isActionDrawerOpen} setVisible={() => setActionDrawerOpen(false)} />
    </div>
  )
}

export default SkuDetails
