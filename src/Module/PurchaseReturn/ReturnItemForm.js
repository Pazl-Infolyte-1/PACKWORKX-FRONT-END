import React, { useEffect, useRef } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';

const ReturnItemForm = ({ items, setItems, formValues, setFormValues }) => {
  
  const { register, control, reset } = useForm({
    defaultValues: {
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = useWatch({ control, name: 'items' });

  const lastHash = useRef('');

  // Set form items from props once
  useEffect(() => {
    // console.log('items', items);
    if (Array.isArray(items) && items.length > 0) {
      const formattedItems = items.map((item) => ({
        item_id: item.item_id ?? 0,
        grn_item_id: item.grn_item_id ?? 0,
        item_code: item.item_code ?? '',
        quantity: parseFloat(item.quantity ?? 0),
        uom: item.uom ?? '',
        unit_price: parseFloat(item.unit_price ?? 0),
        tax_amount: parseFloat(item.tax_amount ?? 0),
        remarks: item.remarks ?? '',
        selected: !!item.selected,
      }));
      reset({ items: formattedItems });
    }
  }, [items, reset]);

  // Watch and compute totals only when data changes
  useEffect(() => {
    const hash = JSON.stringify(watchedItems);

    if (hash !== lastHash.current) {
      lastHash.current = hash;

      const updatedItems = watchedItems.map((item) => {
        const quantity = parseFloat(item.quantity || 0);
        const unit_price = parseFloat(item.unit_price || 0);
        const tax_amount = parseFloat(item.tax_amount || 0);
        const total = quantity * unit_price + tax_amount;
        return { ...item, total };
      });

      const totalQty = updatedItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const grandTotal = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0);

      setItems(updatedItems);
      setFormValues((prev) => ({
        ...prev,
        total_quantity: totalQty,
        grand_total: grandTotal,
      }));
    }
  }, [watchedItems]);

  const addItem = () => {
    append({
      item_id: 0,
      grn_item_id: 0,
      item_code: '',
      quantity: 0,
      uom: '',
      unit_price: 0,
      tax_amount: 0,
      remarks: '',
      selected: false,
    });
  };

  const removeItem = (index) => remove(index);

  return (
    <div className="p-2">
      <button onClick={addItem} className="mb-2 bg-blue-500 text-white px-4 py-2 rounded">
        + Add Item
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th>Select</th>
              <th>GRN Item ID</th>
              <th>Item ID</th>
              <th>Code</th>
              <th>Quantity</th>
              <th>UOM</th>
              <th>Price</th>
              <th>Tax Price</th>
              <th>Total Price</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((item, index) => {
              const quantity = watchedItems?.[index]?.quantity || 0;
              const unit_price = watchedItems?.[index]?.unit_price || 0;
                const tax_amount = watchedItems?.[index]?.tax_amount || 0;
              const total = quantity * unit_price + tax_amount;

              return (
                <tr key={item.id} className="text-center">
                  <td>
                    <input
                      type="checkbox"
                      {...register(`items.${index}.selected`)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`items.${index}.grn_item_id`)}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`items.${index}.item_id`)}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`items.${index}.item_code`)}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`items.${index}.uom`)}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.tax_amount`, { valueAsNumber: true })}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={total.toFixed(2)}
                      readOnly
                      className="border px-2 py-1 bg-gray-100"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`items.${index}.remarks`)}
                      className="border px-2 py-1"
                    />
                  </td>
                  <td>
                    <button onClick={() => removeItem(index)} className="text-red-500">
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnItemForm;
