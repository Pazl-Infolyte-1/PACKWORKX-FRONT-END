import React, { useState, useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { TrashIcon } from '@heroicons/react/solid';
import ActionButton from '../../components/New/ActionButton';
import apiMethods from '../../api/config';
// import { set } from 'core-js/core/dict';


const ItemForm = ({ items = [], setItems, formValues, setFormValues }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [itemList, setItemList] = useState([]);

  // Form with both items and PO totals
  const { control, register, setValue, getValues, reset, watch } = useForm({
    defaultValues: {
      items: items || [],
      // Add PO level fields for totals
      total_qty: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      amount: 0,
      tax_amount: 0,
      total_amount: 0
    }
  });

  // Watch for changes to update parent component
  const formData = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  // Calculate totals from items without setting values
  // This prevents the infinite update loop
  const totals = useMemo(() => {
    try {
      return (getValues('items') || []).reduce((acc, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const amt = parseFloat(item.amount) || 0;
        const sgst = parseFloat(item.sgst) || 0;
        const cgst = parseFloat(item.cgst) || 0;
        const sgstAmt = parseFloat(item.sgst_amount) || 0;
        const cgstAmt = parseFloat(item.cgst_amount) || 0;

        return {
          total_qty: acc.total_qty + qty,
          amount: parseFloat((acc.amount + amt).toFixed(2)),
          total_amount: parseFloat((acc.total_amount + amt).toFixed(2)),
          sgst: parseFloat((acc.sgst + sgstAmt).toFixed(2)),
          cgst: parseFloat((acc.cgst + cgstAmt).toFixed(2)),
          total_incl_gst: parseFloat((acc.total_incl_gst + amt + sgstAmt + cgstAmt).toFixed(2))
        };
      }, {
        total_qty: 0,
        total_amount: 0,
        amount: 0,
        sgst: 0,
        cgst: 0,
        total_incl_gst: 0
      });
    } catch (error) {
      console.error('Totals calculation error:', error);
      return {
        total_qty: 0,
        total_amount: 0,
        amount: 0,
        sgst: 0,
        cgst: 0,
        total_incl_gst: 0
      };
    }
  }, [formData.items]); // Only depend on the items array, not getValues or fields

  // Only update form values with totals when totals change
  useEffect(() => {
    // Update the form values without causing extra re-renders
    setValue('total_qty', totals.total_qty, { shouldDirty: false });
    setValue('cgst_amount', totals.cgst, { shouldDirty: false });
    setValue('sgst_amount', totals.sgst, { shouldDirty: false });
    setValue('amount', totals.total_amount, { shouldDirty: false });
    setValue('tax_amount', totals.cgst + totals.sgst, { shouldDirty: false });
    setValue('total_amount', totals.total_incl_gst, { shouldDirty: false });
  }, [totals, setValue]);

  // Initialize form with items
  // useEffect(() => {
  //   if (items && items.length > 0) {
  //     reset({
  //       items,
  //       total_qty: 0,
  //       cgst_amount: 0,
  //       sgst_amount: 0,
  //       amount: 0,
  //       tax_amount: 0,
  //       total_amount: 0
  //     });

  //     // Calculate row values but don't cause a loop
  //     const timeoutId = setTimeout(() => {
  //       items.forEach((_, index) => {
  //         calculateRowValues(index);
  //       });
  //     }, 0);

  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [items, reset]); // Don't include calculateRowValues in dependencies
// Initialize form with items
useEffect(() => {
  if (items && items.length > 0) {
    // Map incoming items to ensure unit_price maps to standard_cost
    const mappedItems = items.map(item => ({
      ...item,
      standard_cost: item.unit_price || item.standard_cost // Use unit_price if available, fall back to standard_cost
    }));
    
    reset({
      items: mappedItems,
      total_qty: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      amount: 0,
      tax_amount: 0,
      total_amount: 0
    });

    // Calculate row values but don't cause a loop
    const timeoutId = setTimeout(() => {
      mappedItems.forEach((_, index) => {
        calculateRowValues(index);
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }
}, [items, reset]); // Don't include calculateRowValues in dependencies
  // Fetch item list only once
  useEffect(() => {
    fetchItemList();
  }, []);

  // Update parent component with form data including totals
  // Use a ref to prevent unnecessary updates
  const prevTotalsRef = React.useRef(null);
  useEffect(() => {
    // Only update if totals have changed
    if (setFormValues &&
      (!prevTotalsRef.current ||
        JSON.stringify(prevTotalsRef.current) !== JSON.stringify(totals))) {

      const totalValues = {
        ...formValues,
        total_qty: totals.total_qty,
        cgst_amount: totals.cgst,
        sgst_amount: totals.sgst,
        amount: totals.total_amount,
        tax_amount: totals.cgst + totals.sgst,
        total_amount: totals.total_incl_gst
      };
      setFormValues(totalValues);
      prevTotalsRef.current = { ...totals };
    }
  }, [totals, formValues, setFormValues]);

  const fetchItemList = async () => {
    try {
      setIsLoading(true);
      const response = await apiMethods.getItemList({
        search: '',
        client: '',
        page: 1,
        limit: 100,
      });

      const items = response?.data?.data;
      setItemList(items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemChange = (index, selectedItemId) => {
    const selectedItem = itemList.find(item => item.id === parseInt(selectedItemId));

    // console.log('Selected Item:', selectedItem);

    if (selectedItem) {
      setValue(`items.${index}`, {
        item_id: selectedItem.id,
        item_code: selectedItem.item_code,
        po_item_name: selectedItem.po_item_name,
        description: selectedItem.description || '',
        hsn_code: selectedItem.hsn_code || '',
        quantity: 0,
        uom: selectedItem.uom || 'pcs',
        unit_price: selectedItem.standard_cost,
        standard_cost: selectedItem.unit_price || selectedItem.standard_cost,
        sgst: selectedItem.sgst || 9,
        cgst: selectedItem.cgst || 9,
        sgst_amount: 0,
        cgst_amount: 0,
        amount: 0,
        tax_amount: 0,
        total_amount: 0
      });
      calculateRowValues(index);
    }
  };

  const incrementQuantity = (index) => {
    const currentQty = parseFloat(getValues(`items.${index}.quantity`)) || 0;
    setValue(`items.${index}.quantity`, currentQty + 1);
    calculateRowValues(index);
  };

  const decrementQuantity = (index) => {
    const currentQty = parseFloat(getValues(`items.${index}.quantity`)) || 0;
    if (currentQty > 0) {
      setValue(`items.${index}.quantity`, currentQty - 1);
      calculateRowValues(index);
    }
  };

  // Memoize this function to prevent recreation on each render
  const calculateRowValues = React.useCallback((index) => {
    try {
      const item = getValues(`items.${index}`);
      const quantity = Math.max(0, parseFloat(item.quantity) || 0);
      const standardCost = Math.max(0, parseFloat(item.standard_cost) || 0);
      const sgst = Math.max(0, parseFloat(item.sgst) || 9);
      const cgst = Math.max(0, parseFloat(item.cgst) || 9);

      const amount = parseFloat((quantity * standardCost).toFixed(2));
      const sgstAmount = parseFloat(((amount * sgst) / 100).toFixed(2));
      const cgstAmount = parseFloat(((amount * cgst) / 100).toFixed(2));
      const taxAmount = parseFloat((sgstAmount + cgstAmount).toFixed(2));
      const totalAmount = parseFloat((amount + taxAmount).toFixed(2));

      setValue(`items.${index}`, {
        ...item,
        quantity,
        unit_price: standardCost,
        standard_cost: standardCost,
        sgst,
        cgst,
        sgst_amount: sgstAmount,
        cgst_amount: cgstAmount,
        amount: amount,
        tax_amount: taxAmount,
        total_amount: totalAmount
      }, { shouldDirty: false });

      // Use a more efficient way to check if items changed
      const currentItems = getValues('items');
      if (setItems && items && currentItems && JSON.stringify(currentItems) !== JSON.stringify(items)) {
        // Use setTimeout to break the update cycle
        setTimeout(() => {
          setItems(currentItems);
        }, 0);
      }
    } catch (error) {
      console.error('Calculation error:', error);
    }
  }, [getValues, setValue, items, setItems]);

  const addNewItem = () => {
    append({
      item_id: '',
      item_code: '',
      po_item_name: '',
      description: '',
      hsn_code: '',
      quantity: 0,
      uom: 'pcs',
      unit_price: 0,
      standard_cost: 0,
      sgst: 9,
      cgst: 9,
      sgst_amount: 0,
      cgst_amount: 0,
      amount: 0,
      tax_amount: 0,
      total_amount: 0
    });
  };

  return (
    <div className="mt-2 p-4 bg-white rounded-lg border border-[#c2c2c2] w-full max-h-[600px]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Item Details</h2>
        <ActionButton onClick={addNewItem} variant="add" label="+ Add Item" />
      </div>

      <div className="w-[100%] max-h-[350px] mt-4 rounded-[10px] border border-[#c2c2c2]">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2">Item Code</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Rate</th>
                <th className="px-4 py-2">S-GST %</th>
                <th className="px-4 py-2">C-GST %</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Tax</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (

                <tr key={field.id}>
                  <td className="px-4 py-2">
                    <select
                      {...register(`items.${index}.item_id`)}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md"
                    >
                      <option value="">{isLoading ? "Loading..." : "Select Item"}</option>
                      {itemList.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.item_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      {...register(`items.${index}.item_code`)}
                      readOnly
                      className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => decrementQuantity(index)}
                        className="w-8 h-[40px] bg-gray-100 text-gray-600 font-bold rounded-l-md hover:bg-gray-200 border border-[#c2c2c2]"
                      >
                        -
                      </button>
                      <input
                        {...register(`items.${index}.quantity`)}
                        readOnly
                        className="w-[60px] h-[40px] text-center border border-[#c2c2c2]"
                      />
                      <button
                        type="button"
                        onClick={() => incrementQuantity(index)}
                        className="w-8 h-[40px] bg-gray-100 text-gray-600 font-bold rounded-r-md hover:bg-gray-200 border border-[#c2c2c2]"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      {...register(`items.${index}.standard_cost`)}
                      readOnly
                      className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      {...register(`items.${index}.sgst`)}
                      className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-gray-50"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      {...register(`items.${index}.cgst`)}
                      className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md bg-gray-50"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      {...register(`items.${index}.amount`)}
                      readOnly
                      className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      {...register(`items.${index}.tax_amount`)}
                      readOnly
                      className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      {...register(`items.${index}.total_amount`)}
                      readOnly
                      className="w-[110px] h-[40px] text-center border border-[#c2c2c2] rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button type="button" onClick={() => remove(index)}>
                      <TrashIcon className="text-[#ff2d55] w-6 h-6 cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex mt-4">
        <table className="flex-1">
          <tbody className='gap-4'>
            <tr>
              <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                Total Qty: {totals.total_qty}
                <input type="hidden" {...register('total_qty')} />
              </td>
              <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                C-GST: {totals.cgst.toFixed(2)}
                <input type="hidden" {...register('cgst_amount')} />
              </td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                S-GST: {totals.sgst.toFixed(2)}
                <input type="hidden" {...register('sgst_amount')} />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                Total: {totals.total_amount.toFixed(2)}
              </td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2 text-[#7f7f7f] text-[15px] font-lato leading-[22px]">
                Total Incl of GST: {totals.total_incl_gst.toFixed(2)}
                <input type="hidden" {...register('total_amount')} />
                <input type="hidden" {...register('tax_amount')} value={totals.cgst + totals.sgst} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemForm;


























