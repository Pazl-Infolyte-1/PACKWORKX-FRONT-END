import React from 'react';
import PopUp from '../../components/New/PopUp';

const RawMaterialsDetails = ({ visible, setVisible, rawMaterials = [], itemdata = [] }) => {
    const filteredRawMaterials = itemdata.filter(item => item.item_type?.toLowerCase() === "raw-materials");

  return (
    <PopUp
      visible={visible}
      setVisible={setVisible}
      size="xxl"
      header=""
      showCloseButton={true}
      height="600px"
      width="1200px"
    >
      <div className="flex gap-2 h-[500px]">
            {/* Left Section (Scrollable Finished Goods) */}
            <div className="w-[100%] shadow-lg rounded-lg px-2 flex flex-col">
                {/* Fixed Header */}
                <div className="bg-[#8167e5] text-white text-lg font-semibold p-3 rounded-md flex justify-center items-center h-10 mt-4 mb-2">
                    Raw Materials
                </div>

                <div className="overflow-y-auto max-h-[500px] space-y-3 custom-scrollbar px-2">
                    {itemdata.filter(item => item.item_type?.toLowerCase() === "raw-materials").length > 0 ? (
                        itemdata.filter(item => item.item_type?.toLowerCase() === "raw-materials")
                        .map((item) => (

                                // const relatedItem = itemdata.find(i => i.id === item.item_id);


                            <div key={item.id} className="border-2 rounded-md pl-3 shadow-md h-[170px]">
                            <div className=" text-gray-700  grid grid-cols-3 gap-2">

                            <p className="text-[#21338e] font-semibold">
                                Raw Material ID:- #{item.item_code }
                            </p>
                            <p className="text-gray-700 mb-0">
                                Item Name: <span className="font-medium">{item.item_name || "default"}</span>
                            </p>
                            <p className="text-gray-700 mb-0">
                                Specifications : <span className="font-medium">{item.specifications || "default"}</span>
                            </p>
                            <p className="text-[#21338e] font-semibold">
                                Category : <span className="font-medium">{item.category || "default"}</span>
                            </p>
                            <p className="text-gray-700 mb-0">
                                Material Type: <span className="font-medium">{item.item_type}</span>
                            </p>
                            <p className="text-gray-700 mb-0">
                                Manufacturer: <span className="font-medium">{item.manufacturer}</span>
                            </p>
                            <p className="text-gray-700 mb-0">
                                Quantity: <span className="font-medium"> {item.uom}</span>
                            </p>
                            <p className="text-gray-700 mb-0">
                                Reorder Level: <span className="font-medium">{item.reorder_level}</span>
                            </p>
                            <p className="text-gray-700 mb-0">
                                Minimum Stock Level: <span className="font-medium">{item.min_stock_level}</span>
                            </p>
                            
                            </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No raw materials found.</p>
                    )}
                </div>
            </div>
          


          
        
      </div>
    </PopUp>
  );
};

export default RawMaterialsDetails;
