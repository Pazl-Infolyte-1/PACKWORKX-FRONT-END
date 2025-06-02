import React, { useEffect, useRef, useState  } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import apiMethods from '../../api/config'

const ReturnItemForm = ({ items, setItems, formValues, setFormValues }) => {
  const { register, control, reset,getValues  } = useForm({
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);


  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded p-6 max-w-md w-full">
          <button onClick={onClose} className="float-right">&times;</button>
          <div>{children}</div>
        </div>
      </div>
    );
  };

  const openItemDetails = async (item_id) => {
    try {
      const response = await apiMethods.getItemList();
      const items = response?.data?.data || [];
      const item = items.find(i => i.id === parseInt(item_id));
      const customFields = item?.custom_fields ? JSON.parse(item.custom_fields) : {};
  
      setModalContent(
        <>
          <h3 className="text-xl font-semibold mb-3">Custom Fields</h3>
          {Object.entries(customFields).length > 0 ? (
            Object.entries(customFields).map(([key, value], idx) => (
              <p key={idx}>
                <strong>{key}:</strong> {value}
              </p>
            ))
          ) : (
            <p>No custom fields available.</p>
          )}
        </>
      );
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  // Fetch available quantities and reset form
  useEffect(() => {
    const fetchAvailableQuantities = async () => {
      if (!Array.isArray(items) || items.length === 0) return;

      const response = await apiMethods.getinventory();
      const inventoryList = Array.isArray(response?.data?.data) ? response.data.data : [];

      const updatedItems = items.map((item) => {
        const inventoryItem = inventoryList.find(
          (invItem) => invItem.item_id === item.item_id
        );

        return {
          ...item,
          available_quantity: inventoryItem ? parseFloat(inventoryItem.quantity_available) : 0,
        };
      });

      
      // Format for form
      const formatted = updatedItems.map((item) => ({
        item_id: item.item_id ?? 0,
        grn_item_id: item.grn_item_id ?? 0,
        item_code: item.item_code ?? '',
        quantity: parseFloat(item.quantity ?? 0),
        uom: item.uom ?? '',
        unit_price: parseFloat(item.unit_price ?? 0),
        tax_amount: parseFloat(item.tax_amount ?? 0),
        remarks: item.remarks ?? '',
        selected: !!item.selected,
        available_quantity: parseFloat(item.available_quantity ?? 0),
      }));

      reset({ items: formatted });
    };

    fetchAvailableQuantities();
  }, [items, reset]);

  // Recalculate totals when items change
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
  }, [watchedItems, setItems, setFormValues]);

  return (
    <div className="p-2">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th>Select</th>
              <th>GRN Item ID</th>
              <th>Item ID</th>
              <td></td>
              <th>Code</th>
              <th>Available Quantity</th>
              <th>Return Quantity</th>
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
                 <td
                  onClick={() => {
                    const itemId = getValues(`items.${index}.item_id`);
                    if (itemId) {
                      openItemDetails(itemId);
                    } else {
                      console.warn('Item ID is empty');
                    }
                  }}
                  className="cursor-pointer text-blue-600"
                >
                  ℹ️
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
                      readOnly
                      {...register(`items.${index}.available_quantity`)}
                      className="border px-2 py-1 bg-gray-100"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"                      
                      // {...register(`items.${index}.quantity`, { valueAsNumber: true })}
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
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  {modalContent}
</Modal>
      </div>
    </div>
  );
};

export default ReturnItemForm;
